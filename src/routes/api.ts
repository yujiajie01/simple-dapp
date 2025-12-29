import { Router } from 'express';
import { Web3 } from 'web3';
import { ethers } from 'ethers';

// 简单的内存缓存
const cache = new Map();
const CACHE_DURATION = 30000; // 30秒缓存

interface CacheEntry {
  data: any;
  timestamp: number;
}

function getCache(key: string): any | null {
  const entry = cache.get(key) as CacheEntry;
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

const router = Router();

// Web3 连接
const web3 = new Web3(process.env.RPC_URL || 'http://127.0.0.1:8545');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');

// 简单的代币合约 ABI
const TOKEN_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "from", "type": "address"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// 输入验证中间件
const validateAddress = (req: any, res: any, next: any) => {
  const { address } = req.params;
  if (!address || !web3.utils.isAddress(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid address format'
    });
  }
  next();
};

const validateTransferBody = (req: any, res: any, next: any) => {
  const { to, amount, privateKey } = req.body;

  if (!to || !amount || !privateKey) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: to, amount, privateKey'
    });
  }

  if (!web3.utils.isAddress(to)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid recipient address'
    });
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid amount: must be a positive number'
    });
  }

  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    return res.status(400).json({
      success: false,
      error: 'Invalid private key format'
    });
  }

  next();
};

// 健康检查
router.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    cache: {
      size: cache.size,
      maxAge: `${CACHE_DURATION / 1000}s`
    }
  });
});

// 获取网络信息
router.get('/network', async (req, res) => {
  try {
    const cacheKey = 'network_info';
    let networkData = getCache(cacheKey);

    if (!networkData) {
      // 并发生成所有网络请求以提高性能
      const [networkId, blockNumber, gasPrice] = await Promise.all([
        web3.eth.net.getId(),
        web3.eth.getBlockNumber(),
        web3.eth.getGasPrice()
      ]);

      networkData = {
        networkId,
        blockNumber: Number(blockNumber),
        gasPrice: web3.utils.fromWei(gasPrice, 'gwei')
      };

      setCache(cacheKey, networkData);
    }

    res.json({
      success: true,
      data: networkData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch network info',
      message: error.message
    });
  }
});

// 获取账户余额
router.get('/balance/:address', validateAddress, async (req, res) => {
  try {
    const { address } = req.params;

    const balance = await web3.eth.getBalance(address);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');

    // 如果有合约地址，获取代币余额
    let tokenBalance = null;
    if (process.env.CONTRACT_ADDRESS) {
      try {
        const contract = new web3.eth.Contract(TOKEN_ABI, process.env.CONTRACT_ADDRESS);
        const tokenBalanceRaw = await contract.methods.balanceOf(address).call();
        tokenBalance = web3.utils.fromWei(String(tokenBalanceRaw), 'ether');
      } catch (error) {
        console.log('获取代币余额失败:', error);
      }
    }

    res.json({
      success: true,
      data: {
        address,
        ethBalance: balanceInEth,
        tokenBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance',
      message: error.message
    });
  }
});

// 发送 ETH 转账
router.post('/transfer/eth', validateTransferBody, async (req, res) => {
  try {
    const { to, amount, privateKey } = req.body;

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    // 检查发送者余额
    const balance = await web3.eth.getBalance(account.address);
    const amountInWei = web3.utils.toWei(amount, 'ether');
    const gasPrice = await web3.eth.getGasPrice();
    const estimatedGasCost = BigInt('21000') * BigInt(String(gasPrice));
    const totalCost = BigInt(String(amountInWei)) + estimatedGasCost;

    if (BigInt(String(balance)) < totalCost) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance for transaction'
      });
    }

    const tx = {
      from: account.address,
      to,
      value: amountInWei,
      gas: 21000
    };

    const receipt = await web3.eth.sendTransaction(tx);

    res.json({
      success: true,
      data: {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: account.address,
        to,
        amount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to send ETH',
      message: error.message
    });
  }
});

// 发送代币转账
router.post('/transfer/token', validateTransferBody, async (req, res) => {
  try {
    const { to, amount, privateKey } = req.body;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: 'Contract address not configured'
      });
    }

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const contract = new web3.eth.Contract(TOKEN_ABI, contractAddress);

    // 检查代币余额
    const tokenBalance = await contract.methods.balanceOf(account.address).call();
    const amountInWei = web3.utils.toWei(amount, 'ether');

    if (BigInt(String(tokenBalance)) < BigInt(String(amountInWei))) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient token balance'
      });
    }

    const tx = await contract.methods.transfer(to, amountInWei).send({
      from: account.address,
      gas: '100000'
    });

    res.json({
      success: true,
      data: {
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        from: account.address,
        to,
        amount
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to send token',
      message: error.message
    });
  }
});

// 获取代币信息
router.get('/token/info', async (req, res) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: 'Contract address not configured'
      });
    }

    const cacheKey = `token_info_${contractAddress}`;
    let tokenData = getCache(cacheKey);

    if (!tokenData) {
      const contract = new web3.eth.Contract(TOKEN_ABI, contractAddress);

      // 并发生成所有合约调用以提高性能
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call()
      ]);

      tokenData = {
        address: contractAddress,
        name: String(name),
        symbol: String(symbol),
        decimals: parseInt(String(decimals)),
        totalSupply: web3.utils.fromWei(String(totalSupply), 'ether')
      };

      // 代币信息相对稳定，缓存时间可以长一些
      setCache(cacheKey, tokenData);
      // 延长缓存时间到5分钟
      setTimeout(() => cache.delete(cacheKey), 300000);
    }

    res.json({
      success: true,
      data: tokenData
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token info',
      message: error.message
    });
  }
});

// 获取交易历史（优化版）
router.get('/transactions/:address', validateAddress, async (req, res) => {
  try {
    const { address } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50); // 最大50条

    const cacheKey = `transactions_${address}_${page}_${limit}`;
    let cachedResult = getCache(cacheKey);

    if (!cachedResult) {
      const blockNumber = await web3.eth.getBlockNumber();
      const transactions = [];
      const maxBlocks = 100; // 增加检查的区块数量
      const startBlock = Math.max(0, Number(blockNumber) - maxBlocks);

      // 使用并发方式获取区块，提高性能
      const blockPromises = [];
      for (let i = startBlock; i <= Number(blockNumber); i++) {
        blockPromises.push(web3.eth.getBlock(i, true));
      }

      const blocks = await Promise.all(blockPromises);

      // 并行处理所有区块的交易
      for (const block of blocks) {
        if (block && block.transactions) {
          for (const tx of block.transactions) {
            if (typeof tx === 'object' && tx !== null) {
              if (tx.from?.toLowerCase() === address.toLowerCase() ||
                  tx.to?.toLowerCase() === address.toLowerCase()) {
                transactions.push({
                  hash: tx.hash,
                  blockNumber: Number(tx.blockNumber),
                  from: tx.from,
                  to: tx.to,
                  value: web3.utils.fromWei(String(tx.value), 'ether'),
                  timestamp: block.timestamp,
                  gasPrice: tx.gasPrice ? web3.utils.fromWei(String(tx.gasPrice), 'gwei') : null,
                  gasUsed: block.gasUsed
                });

                // 收集足够的交易后停止
                if (transactions.length >= 200) break;
              }
            }
          }
          if (transactions.length >= 200) break;
        }
      }

      // 按时间戳排序（最新的在前）
      transactions.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

      // 分页
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTransactions = transactions.slice(startIndex, endIndex);

      cachedResult = {
        address,
        transactions: paginatedTransactions,
        pagination: {
          page,
          limit,
          total: transactions.length,
          pages: Math.ceil(transactions.length / limit)
        }
      };

      // 缓存交易历史（较短时间，因为交易会变化）
      setCache(cacheKey, cachedResult);
    }

    res.json({
      success: true,
      data: cachedResult
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

export default router;
