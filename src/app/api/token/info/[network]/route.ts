import { NextRequest, NextResponse } from 'next/server'
import { Web3 } from 'web3'

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
  }
]

// 简单的内存缓存
const cache = new Map()
const CACHE_DURATION = 300000 // 5分钟缓存（代币信息相对稳定）

interface CacheEntry {
  data: any
  timestamp: number
}

function getCache(key: string): any | null {
  const entry = cache.get(key) as CacheEntry
  if (!entry) return null

  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key)
    return null
  }

  return entry.data
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// BigInt 序列化函数
const serializeBigInt = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value
  }))
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
}

// 获取网络配置的辅助函数
function getNetworkConfig(network: string = 'localhost') {
  return NETWORKS[network as keyof typeof NETWORKS] || NETWORKS.localhost
}

// 创建网络特定的 Web3 实例
function createWeb3Instance(network: string = 'localhost') {
  const config = getNetworkConfig(network)
  return new Web3(config.rpcUrl)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { network: string } }
) {
  try {
    const network = params.network || 'localhost'
    const contractAddress = process.env[`${network.toUpperCase()}_CONTRACT_ADDRESS`] || process.env.CONTRACT_ADDRESS

    if (!contractAddress) {
      return NextResponse.json({
        success: false,
        error: `Contract address not configured for network: ${network}`
      }, { status: 400 })
    }

    const cacheKey = `token_info_${network}_${contractAddress}`
    let tokenData = getCache(cacheKey)

    if (!tokenData) {
      const web3Instance = createWeb3Instance(network)
      const contract = new web3Instance.eth.Contract(TOKEN_ABI, contractAddress)

      // 并发生成所有合约调用以提高性能
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call()
      ])

      tokenData = {
        network: getNetworkConfig(network).name,
        address: contractAddress,
        name: String(name),
        symbol: String(symbol),
        decimals: parseInt(String(decimals)),
        totalSupply: web3Instance.utils.fromWei(String(totalSupply), 'ether')
      }

      // 代币信息相对稳定，缓存时间可以长一些
      setCache(cacheKey, tokenData)
      // 延长缓存时间到5分钟
      setTimeout(() => cache.delete(cacheKey), CACHE_DURATION)
    }

    return NextResponse.json(serializeBigInt({
      success: true,
      data: tokenData
    }))
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch token info',
      message: error.message
    }, { status: 500 })
  }
}
