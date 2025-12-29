'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface BalanceData {
  address: string
  network: string
  ethBalance: string
  tokenBalance: string | null
  currency: string
}

export function BalanceDisplay() {
  const { address, isConnected } = useAccount()
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/balance/${address}/localhost`)
      const data = await response.json()

      if (data.success) {
        setBalance(data.data)
      } else {
        setError(data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance()
    }
  }, [isConnected, address])

  if (!isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          💰 账户余额
        </h3>
        <p className="text-gray-600">
          请先连接您的钱包
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        💰 账户余额
      </h3>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {balance && !loading && (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">地址</p>
            <p className="font-mono text-sm break-all">{balance.address}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">网络</p>
            <p className="font-medium">{balance.network}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{balance.currency} 余额</p>
              <p className="text-lg font-semibold">{balance.ethBalance}</p>
            </div>

            {balance.tokenBalance && (
              <div>
                <p className="text-sm text-gray-600">代币余额</p>
                <p className="text-lg font-semibold">{balance.tokenBalance} STK</p>
              </div>
            )}
          </div>

          <button
            onClick={fetchBalance}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            刷新余额
          </button>
        </div>
      )}
    </div>
  )
}
