import { NextRequest, NextResponse } from 'next/server'
import { Web3 } from 'web3'

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

// 输入验证
function validateTransferBody(body: any): { isValid: boolean; error?: string } {
  const { to, amount, privateKey } = body
  const web3Instance = new Web3()

  if (!to || !amount || !privateKey) {
    return { isValid: false, error: 'Missing required fields: to, amount, privateKey' }
  }

  if (!web3Instance.utils.isAddress(to)) {
    return { isValid: false, error: 'Invalid recipient address' }
  }

  const amountNum = parseFloat(amount)
  if (isNaN(amountNum) || amountNum <= 0) {
    return { isValid: false, error: 'Invalid amount: must be a positive number' }
  }

  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    return { isValid: false, error: 'Invalid private key format' }
  }

  return { isValid: true }
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

export async function POST(
  request: NextRequest,
  { params }: { params: { network: string } }
) {
  try {
    const network = params.network || 'localhost'
    const body = await request.json()
    const validation = validateTransferBody(body)

    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: validation.error
      }, { status: 400 })
    }

    const { to, amount, privateKey } = body
    const web3Instance = createWeb3Instance(network)

    const account = web3Instance.eth.accounts.privateKeyToAccount(privateKey)
    web3Instance.eth.accounts.wallet.add(account)

    // 检查发送者余额
    const balance = await web3Instance.eth.getBalance(account.address)
    const amountInWei = web3Instance.utils.toWei(amount, 'ether')
    const gasPrice = await web3Instance.eth.getGasPrice()
    const estimatedGasCost = BigInt('21000') * BigInt(String(gasPrice))
    const totalCost = BigInt(String(amountInWei)) + estimatedGasCost

    if (BigInt(String(balance)) < totalCost) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient balance for transaction'
      }, { status: 400 })
    }

    const tx = {
      from: account.address,
      to,
      value: amountInWei,
      gas: 21000
    }

    const receipt = await web3Instance.eth.sendTransaction(tx)

    return NextResponse.json(serializeBigInt({
      success: true,
      data: {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: account.address,
        to,
        amount
      }
    }))
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send ETH',
      message: error.message
    }, { status: 500 })
  }
}
