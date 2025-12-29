import { Router } from 'express';
import { Web3 } from 'web3';
import { ethers } from 'ethers';

// BigInt 序列化函数
const serializeBigInt = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }));
};

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

// 网络配置
const NETWORKS = {
  localhost: {
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    currency: 'ETH',
    blockExplorer: null
  },
  mainnet: {
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 1,
    currency: 'ETH',
    blockExplorer: 'https://etherscan.io'
  },
  sepolia: {
    name: 'Sepolia Testnet',
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 11155111,
    currency: 'SepoliaETH',
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  goerli: {
    name: 'Goerli Testnet',
    rpcUrl: process.env.GOERLI_RPC_URL || 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 5,
    currency: 'GoerliETH',
    blockExplorer: 'https://goerli.etherscan.io'
  }
};

// 获取网络配置的辅助函数
function getNetworkConfig(network: string = 'localhost') {
  return NETWORKS[network as keyof typeof NETWORKS] || NETWORKS.localhost;
}

// 创建网络特定的 Web3 实例
function createWeb3Instance(network: string = 'localhost') {
  const config = getNetworkConfig(network);
  return new Web3(config.rpcUrl);
}

// 创建网络特定的 ethers provider
function createEthersProvider(network: string = 'localhost') {
  const config = getNetworkConfig(network);
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

const router = Router();

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
  const web3Instance = new Web3(); // 使用默认实例进行地址验证
  if (!address || !web3Instance.utils.isAddress(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid address format'
    });
  }
  next();
};

const validateTransferBody = (req: any, res: any, next: any) => {
  const { to, amount, privateKey } = req.body;
  const web3Instance = new Web3(); // 使用默认实例进行验证

  if (!to || !amount || !privateKey) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: to, amount, privateKey'
    });
  }

  if (!web3Instance.utils.isAddress(to)) {
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

// 获取支持的网络列表
router.get('/networks', (req, res) => {
  const networks = Object.keys(NETWORKS).map(key => ({
    id: key,
    ...NETWORKS[key as keyof typeof NETWORKS]
  }));

  res.json({
    success: true,
    data: networks
  });
});

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
router.get('/network/:network?', async (req, res) => {
  try {
    const network = req.params.network || 'localhost';
    const cacheKey = `network_info_${network}`;
    let networkData = getCache(cacheKey);

    if (!networkData) {
      const web3Instance = createWeb3Instance(network);
      const config = getNetworkConfig(network);

      // 并发生成所有网络请求以提高性能
      const [networkId, blockNumber, gasPrice] = await Promise.all([
        web3Instance.eth.net.getId(),
        web3Instance.eth.getBlockNumber(),
        web3Instance.eth.getGasPrice()
      ]);

      networkData = {
        network: config.name,
        networkId,
        chainId: config.chainId,
        blockNumber: Number(blockNumber),
        gasPrice: web3Instance.utils.fromWei(gasPrice, 'gwei'),
        currency: config.currency,
        blockExplorer: config.blockExplorer
      };

      setCache(cacheKey, networkData);
    }

    res.json(serializeBigInt({
      success: true,
      data: networkData
    }));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch network info',
      message: error.message
    });
  }
});

// 获取账户余额
router.get('/balance/:address/:network?', validateAddress, async (req, res) => {
  try {
    const { address, network = 'localhost' } = req.params;
    const web3Instance = createWeb3Instance(network);

    const balance = await web3Instance.eth.getBalance(address);
    const balanceInEth = web3Instance.utils.fromWei(balance, 'ether');

    // 如果有合约地址，获取代币余额
    let tokenBalance = null;
    const contractAddress = process.env[`${network.toUpperCase()}_CONTRACT_ADDRESS`] || process.env.CONTRACT_ADDRESS;
    if (contractAddress) {
      try {
        const contract = new web3Instance.eth.Contract(TOKEN_ABI, contractAddress);
        const tokenBalanceRaw = await contract.methods.balanceOf(address).call();
        tokenBalance = web3Instance.utils.fromWei(String(tokenBalanceRaw), 'ether');
      } catch (error) {
        console.log('获取代币余额失败:', error);
      }
    }

    res.json({
      success: true,
      data: {
        address,
        network: getNetworkConfig(network).name,
        ethBalance: balanceInEth,
        tokenBalance,
        currency: getNetworkConfig(network).currency
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
router.post('/transfer/eth/:network?', validateTransferBody, async (req, res) => {
  try {
    const { to, amount, privateKey } = req.body;
    const network = req.params.network || 'localhost';
    const web3Instance = createWeb3Instance(network);

    const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
    web3Instance.eth.accounts.wallet.add(account);

    // 检查发送者余额
    const balance = await web3Instance.eth.getBalance(account.address);
    const amountInWei = web3Instance.utils.toWei(amount, 'ether');
    const gasPrice = await web3Instance.eth.getGasPrice();
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

    const receipt = await web3Instance.eth.sendTransaction(tx);

    res.json(serializeBigInt({
      success: true,
      data: {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: account.address,
        to,
        amount
      }
    }));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to send ETH',
      message: error.message
    });
  }
});

// 发送代币转账
router.post('/transfer/token/:network?', validateTransferBody, async (req, res) => {
  try {
    const { to, amount, privateKey } = req.body;
    const network = req.params.network || 'localhost';
    const web3Instance = createWeb3Instance(network);
    const contractAddress = process.env[`${network.toUpperCase()}_CONTRACT_ADDRESS`] || process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: 'Contract address not configured'
      });
    }

    const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey);
    web3Instance.eth.accounts.wallet.add(account);

    const contract = new web3Instance.eth.Contract(TOKEN_ABI, contractAddress);

    // 检查代币余额
    const tokenBalance = await contract.methods.balanceOf(account.address).call();
    const amountInWei = web3Instance.utils.toWei(amount, 'ether');

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

    res.json(serializeBigInt({
      success: true,
      data: {
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        from: account.address,
        to,
        amount
      }
    }));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to send token',
      message: error.message
    });
  }
});

// 获取代币信息
router.get('/token/info/:network?', async (req, res) => {
  try {
    const network = req.params.network || 'localhost';
    const contractAddress = process.env[`${network.toUpperCase()}_CONTRACT_ADDRESS`] || process.env.CONTRACT_ADDRESS;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: `Contract address not configured for network: ${network}`
      });
    }

    const cacheKey = `token_info_${network}_${contractAddress}`;
    let tokenData = getCache(cacheKey);

    if (!tokenData) {
      const web3Instance = createWeb3Instance(network);
      const contract = new web3Instance.eth.Contract(TOKEN_ABI, contractAddress);

      // 并发生成所有合约调用以提高性能
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call()
      ]);

      tokenData = {
        network: getNetworkConfig(network).name,
        address: contractAddress,
        name: String(name),
        symbol: String(symbol),
        decimals: parseInt(String(decimals)),
        totalSupply: web3Instance.utils.fromWei(String(totalSupply), 'ether')
      };

      // 代币信息相对稳定，缓存时间可以长一些
      setCache(cacheKey, tokenData);
      // 延长缓存时间到5分钟
      setTimeout(() => cache.delete(cacheKey), 300000);
    }

    res.json(serializeBigInt({
      success: true,
      data: tokenData
    }));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token info',
      message: error.message
    });
  }
});

// 获取交易历史（优化版）
router.get('/transactions/:address/:network?', validateAddress, async (req, res) => {
  try {
    const { address, network = 'localhost' } = req.params;
    const web3Instance = createWeb3Instance(network);
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50); // 最大50条

    const cacheKey = `transactions_${network}_${address}_${page}_${limit}`;
    let cachedResult = getCache(cacheKey);

    if (!cachedResult) {
      const blockNumber = await web3Instance.eth.getBlockNumber();
      const transactions = [];
      const maxBlocks = 100; // 增加检查的区块数量
      const startBlock = Math.max(0, Number(blockNumber) - maxBlocks);

      // 使用并发方式获取区块，提高性能
      const blockPromises = [];
      for (let i = startBlock; i <= Number(blockNumber); i++) {
        blockPromises.push(web3Instance.eth.getBlock(i, true));
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
                  value: web3Instance.utils.fromWei(String(tx.value), 'ether'),
                  timestamp: block.timestamp,
                  gasPrice: tx.gasPrice ? web3Instance.utils.fromWei(String(tx.gasPrice), 'gwei') : null,
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
        network: getNetworkConfig(network).name,
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

    res.json(serializeBigInt({
      success: true,
      data: cachedResult
    }));
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

export default router;
