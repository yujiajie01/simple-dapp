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
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

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

// 输入验证中间件
function validateAddress(address: string): boolean {
  const web3Instance = new Web3()
  return address && web3Instance.utils.isAddress(address)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string; network: string } }
) {
  try {
    const { address, network = 'localhost' } = params

    if (!validateAddress(address)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid address format'
      }, { status: 400 })
    }

    const web3Instance = createWeb3Instance(network)

    const balance = await web3Instance.eth.getBalance(address)
    const balanceInEth = web3Instance.utils.fromWei(balance, 'ether')

    // 如果有合约地址，获取代币余额
    let tokenBalance = null
    const contractAddress = process.env[`${network.toUpperCase()}_CONTRACT_ADDRESS`] || process.env.CONTRACT_ADDRESS
    if (contractAddress) {
      try {
        const contract = new web3Instance.eth.Contract(TOKEN_ABI, contractAddress)
        const tokenBalanceRaw = await contract.methods.balanceOf(address).call()
        tokenBalance = web3Instance.utils.fromWei(String(tokenBalanceRaw), 'ether')
      } catch (error) {
        console.log('获取代币余额失败:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        address,
        network: getNetworkConfig(network).name,
        ethBalance: balanceInEth,
        tokenBalance,
        currency: getNetworkConfig(network).currency
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch balance',
      message: error.message
    }, { status: 500 })
  }
}
