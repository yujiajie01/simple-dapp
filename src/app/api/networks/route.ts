import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    const networks = Object.keys(NETWORKS).map(key => ({
      id: key,
      ...NETWORKS[key as keyof typeof NETWORKS]
    }))

    return NextResponse.json({
      success: true,
      data: networks
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch networks',
      message: error.message
    }, { status: 500 })
  }
}
