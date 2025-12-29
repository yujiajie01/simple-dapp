// 简单的 ethers 测试脚本
const { ethers } = require('ethers');

console.log('Ethers version:', ethers.version);

try {
  // 测试 JsonRpcProvider
  console.log('JsonRpcProvider available:', typeof ethers.JsonRpcProvider === 'function');

  // 测试连接到本地网络
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  console.log('Provider created successfully');

  console.log('✅ Ethers 测试通过');
} catch (error) {
  console.error('❌ Ethers 测试失败:', error.message);
  process.exit(1);
}
