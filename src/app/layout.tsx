import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Web3Provider } from './components/Web3Provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simple DApp - Web3 应用',
  description: '一个简单的 Web3 去中心化应用，支持代币转账和钱包管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
