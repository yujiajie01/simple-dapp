import { NextRequest, NextResponse } from 'next/server'
import { Web3 } from 'web3'

// 简单的内存缓存
const cache = new Map()
const CACHE_DURATION = 30000 // 30秒缓存

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
    const cacheKey = `network_info_${network}`
    let networkData = getCache(cacheKey)

    if (!networkData) {
      const web3Instance = createWeb3Instance(network)
      const config = getNetworkConfig(network)

      // 并发生成所有网络请求以提高性能
      const [networkId, blockNumber, gasPrice] = await Promise.all([
        web3Instance.eth.net.getId(),
        web3Instance.eth.getBlockNumber(),
        web3Instance.eth.getGasPrice()
      ])

      networkData = {
        network: config.name,
        networkId,
        chainId: config.chainId,
        blockNumber: Number(blockNumber),
        gasPrice: web3Instance.utils.fromWei(gasPrice, 'gwei'),
        currency: config.currency,
        blockExplorer: config.blockExplorer
      }

      setCache(cacheKey, networkData)
    }

    return NextResponse.json(serializeBigInt({
      success: true,
      data: networkData
    }))
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch network info',
      message: error.message
    }, { status: 500 })
  }
}
