import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Simple DApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [
    mainnet,
    sepolia,
    ...(process.env.NODE_ENV === 'development' ? [hardhat] : [])
  ],
  ssr: true,
})
