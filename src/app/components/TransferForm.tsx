'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface TransferResult {
  transactionHash: string
  blockNumber: number
  from: string
  to: string
  amount: string
}

export function TransferForm() {
  const { address, isConnected } = useAccount()
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
    privateKey: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TransferResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/transfer/eth/localhost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setFormData({ to: '', amount: '', privateKey: '' })
      } else {
        setError(data.error)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isConnected) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          📤 发送 ETH
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
        📤 发送 ETH
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            接收地址
          </label>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            转账金额 (ETH)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.01"
            step="0.0001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            私钥
          </label>
          <input
            type="password"
            name="privateKey"
            value={formData.privateKey}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            ⚠️ 仅用于演示，生产环境请使用钱包签名
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '发送中...' : '发送 ETH'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-green-800 font-medium mb-2">转账成功!</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>交易哈希:</strong> {result.transactionHash}</p>
            <p><strong>区块号:</strong> {result.blockNumber}</p>
            <p><strong>发送地址:</strong> {result.from}</p>
            <p><strong>接收地址:</strong> {result.to}</p>
            <p><strong>金额:</strong> {result.amount} ETH</p>
          </div>
        </div>
      )}
    </div>
  )
}
