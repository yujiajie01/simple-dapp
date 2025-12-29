import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { BalanceDisplay } from '../../components/BalanceDisplay'
import { TransferForm } from '../../components/TransferForm'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Simple DApp
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                仪表板
              </Link>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Web3 仪表板
            </h1>
            <p className="text-gray-600">
              管理您的数字资产和区块链交互
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceDisplay />
            <TransferForm />
          </div>

          {/* 其他功能预览 */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              更多功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  📊 交易历史
                </h3>
                <p className="text-gray-600 mb-4">
                  查看所有交易记录和区块链活动
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  即将推出
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  🪙 代币管理
                </h3>
                <p className="text-gray-600 mb-4">
                  管理您的 ERC-20 代币
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  即将推出
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  🌐 多网络支持
                </h3>
                <p className="text-gray-600 mb-4">
                  支持多个区块链网络
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  即将推出
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
