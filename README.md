# Simple DApp - Node.js Web3 Token Application

# Simple DApp - Node.js Web3 代币应用

A simple decentralized application (DApp) based on Node.js + TypeScript, including ERC-20 token contract and complete backend API.

一个基于 Node.js + TypeScript 的简单去中心化应用（DApp），包含 ERC-20 代币合约和完整的后端 API。

## 🚀 Features

## 🚀 功能特性

### Core Features
### 核心功能
- ✅ **ERC-20 Token Smart Contract** - Complete token implementation supporting transfers, approvals and other standard functions
- ✅ **Token Minting and Transfer** - Secure token minting and transfer operations
- ✅ **ETH Transfer Function** - Native Ethereum transfer support
- ✅ **Balance Inquiry** - Real-time ETH and token balance queries
- ✅ **Transaction History Query** - Paginated transaction history records
- ✅ **Network Information View** - Real-time network status monitoring

- ✅ **ERC-20 代币智能合约** - 完整的代币实现，支持转账、授权等标准功能
- ✅ **代币铸造和转账** - 安全的代币铸造和转账操作
- ✅ **ETH 转账功能** - 原生以太坊转账支持
- ✅ **余额查询** - 实时查询 ETH 和代币余额
- ✅ **交易历史查询** - 分页查询交易历史记录
- ✅ **网络信息查看** - 实时网络状态监控

### User Experience
### 用户体验
- ✅ **Beautiful Frontend Interface** - Modern responsive design
- ✅ **Real-time Form Validation** - Smart input validation and error prompts
- ✅ **Loading State Indicators** - Friendly user feedback
- ✅ **Copy to Clipboard** - One-click copy addresses and transaction hashes
- ✅ **Notification System** - Real-time operation status feedback

- ✅ **美观的前端界面** - 现代化响应式设计
- ✅ **实时表单验证** - 智能输入验证和错误提示
- ✅ **加载状态指示** - 友好的用户反馈
- ✅ **复制到剪贴板** - 一键复制地址和交易哈希
- ✅ **通知系统** - 实时操作状态反馈

### Technical Features
### 技术特性
- ✅ **High-performance Caching** - Smart caching for improved response speed
- ✅ **Concurrent Processing** - Optimized concurrent request performance
- ✅ **Error Handling** - Comprehensive error handling mechanisms
- ✅ **TypeScript Support** - Complete type safety
- ✅ **Unit Testing** - Comprehensive smart contract testing
- ✅ **Code Layering** - Clear architectural design

## 🛠️ Technology Stack

## 🛠️ 技术栈

- **Backend**: Node.js + TypeScript + Express
- **Blockchain**: Solidity + Hardhat + Web3.js + Ethers.js
- **Frontend**: HTML5 + CSS3 + JavaScript (ES6+)
- **Testnet**: Hardhat Local Network

- **后端**: Node.js + TypeScript + Express
- **区块链**: Solidity + Hardhat + Web3.js + Ethers.js
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **测试网**: Hardhat 本地网络

## 📦 Installation

## 📦 安装依赖

```bash
# Install dependencies using yarn
yarn install

# Or using npm
npm install
```

```bash
# 使用 yarn 安装依赖
yarn install

# 或使用 npm
npm install
```

## ⚙️ Environment Configuration

## ⚙️ 环境配置

1. Copy environment variable template:
1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. Configure `.env` file:
2. 配置 `.env` 文件：
```env
# Blockchain network configuration
RPC_URL=http://127.0.0.1:8545

# Contract address (update after deployment)
CONTRACT_ADDRESS=

# Development account private key (for testing only)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Server configuration
PORT=3000
```

```env
# 区块链网络配置
RPC_URL=http://127.0.0.1:8545

# 合约地址（部署后更新）
CONTRACT_ADDRESS=

# 开发账户私钥（仅用于测试）
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# 服务器配置
PORT=3000
```

## 🚀 Running the Application

## 🚀 运行应用

### 1. Start Local Blockchain Network

### 1. 启动本地区块链网络

```bash
# Terminal 1: Start Hardhat local network
npx hardhat node
```

```bash
# 终端 1: 启动 Hardhat 本地网络
npx hardhat node
```

### 2. Compile and Deploy Smart Contracts

### 2. 编译和部署智能合约

```bash
# Terminal 2: Compile contracts
yarn compile-contract

# Deploy contracts
yarn deploy-contract
```

```bash
# 终端 2: 编译合约
yarn compile-contract

# 部署合约
yarn deploy-contract
```

After successful deployment, copy the contract address to `CONTRACT_ADDRESS` in the `.env` file.

部署成功后，将合约地址复制到 `.env` 文件中的 `CONTRACT_ADDRESS`。

### 3. Start Backend Service

### 3. 启动后端服务

```bash
# Terminal 3: Start development server
yarn dev
```

```bash
# 终端 3: 启动开发服务器
yarn dev
```

### 4. Access the Application

### 4. 访问应用

Open browser and visit: http://localhost:3000

打开浏览器访问：http://localhost:3000

## 📋 API Documentation

## 📋 API 接口文档

### GET /api/health
Health check endpoint that returns system status and performance metrics

健康检查接口，返回系统状态和性能指标

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": "3600s",
  "memory": {
    "used": "45MB",
    "total": "120MB",
    "external": "5MB"
  },
  "cache": {
    "size": 3,
    "maxAge": "30s"
  }
}
```

### GET /api/network
Get network information (with caching)

获取网络信息（带缓存）

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "data": {
    "networkId": 1337,
    "blockNumber": 12345,
    "gasPrice": "1.5"
  }
}
```

### GET /api/balance/:address
Query account balance

查询账户余额

**Parameters:**
**参数:**
- `address`: Ethereum address
- `address`: 以太坊地址

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "data": {
    "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "ethBalance": "9999.999",
    "tokenBalance": "999999"
  }
}
```

### POST /api/transfer/eth
ETH transfer

ETH 转账

**Request Body:**
**请求体:**
```json
{
  "to": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "amount": "0.1",
  "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}
```

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "data": {
    "transactionHash": "0x123...",
    "blockNumber": 12346,
    "from": "0xabc...",
    "to": "0xf39...",
    "amount": "0.1"
  }
}
```

### POST /api/transfer/token
Token transfer

代币转账

**Request Body:**
**请求体:**
```json
{
  "to": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "amount": "100",
  "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}
```

### GET /api/token/info
Get token information (with caching)

获取代币信息（带缓存）

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "data": {
    "address": "0x123...",
    "name": "Simple Token",
    "symbol": "STK",
    "decimals": 18,
    "totalSupply": "1000000"
  }
}
```

### GET /api/transactions/:address
Get transaction history (with pagination support)

获取交易历史（支持分页）

**Parameters:**
**参数:**
- `address`: Ethereum address
- `page`: Page number (optional, default 1)
- `limit`: Items per page (optional, default 20, max 50)

- `address`: 以太坊地址
- `page`: 页码 (可选，默认 1)
- `limit`: 每页条数 (可选，默认 20，最大 50)

**Response Example:**
**响应示例:**
```json
{
  "success": true,
  "data": {
    "address": "0xf39...",
    "transactions": [
      {
        "hash": "0x123...",
        "blockNumber": 12345,
        "from": "0xabc...",
        "to": "0xf39...",
        "value": "0.1",
        "timestamp": 1700000000,
        "gasPrice": "1.5",
        "gasUsed": 21000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

## 🧪 Testing Instructions

## 🧪 测试说明

### Contract Testing
### 合约测试
```bash
# Run all contract tests
yarn test-contract

# View test coverage
npx hardhat coverage
```

```bash
# 运行所有合约测试
yarn test-contract

# 查看测试覆盖率
npx hardhat coverage
```

### Default Accounts
### 默认账户
Hardhat local network provides 20 pre-funded accounts:

Hardhat 本地网络提供 20 个预资金账户：

- **Account 0**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Balance**: 10000 ETH

- **账户 0**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **私钥**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **余额**: 10000 ETH

## 🛠️ Development Guide

## 🛠️ 开发指南

### Project Architecture
### 项目架构
```
simple-dapp/
├── contracts/          # Smart contracts (Solidity)
├── src/
│   ├── routes/         # API routes
│   ├── middleware.ts   # Middleware
│   └── index.ts        # Application entry point
├── public/             # Frontend static files
├── test/               # Contract tests
└── scripts/            # Deployment scripts
```

```
simple-dapp/
├── contracts/          # 智能合约 (Solidity)
├── src/
│   ├── routes/         # API 路由
│   ├── middleware.ts   # 中间件
│   └── index.ts        # 应用入口
├── public/             # 前端静态文件
├── test/               # 合约测试
└── scripts/            # 部署脚本
```

### Code Standards

### 代码规范

#### Smart Contracts
#### 智能合约
- Use Solidity ^0.8.19
- Follow ERC-20 standards
- Include complete event logs
- Implement ownership control

- 使用 Solidity ^0.8.19
- 遵循 ERC-20 标准
- 包含完整的事件日志
- 实现所有权控制

#### Backend API
#### 后端 API
- Use TypeScript strict mode
- Return unified response format
- Comprehensive error handling
- Input validation and sanitization

- 使用 TypeScript 严格模式
- 返回统一的响应格式
- 完善的错误处理
- 输入验证和清理

#### Frontend Interface
#### 前端界面
- Modern CSS and responsive design
- Real-time form validation
- User-friendly error prompts
- Accessibility support

- 现代 CSS 和响应式设计
- 实时表单验证
- 用户友好的错误提示
- 无障碍访问支持

### Performance Optimization
### 性能优化
- **Caching Strategy**: Network info cached for 30 seconds, token info cached for 5 minutes
- **Concurrent Processing**: Use Promise.all for parallel requests
- **Paginated Queries**: Transaction history supports pagination to avoid large data volumes
- **Memory Management**: Automatic cleanup of expired cache

- **缓存策略**: 网络信息缓存 30 秒，代币信息缓存 5 分钟
- **并发处理**: 使用 Promise.all 进行并行请求
- **分页查询**: 交易历史支持分页，避免大数据量
- **内存管理**: 自动清理过期缓存

### Security Considerations
### 安全注意事项
- **Private Key Management**: Never use plaintext private keys in production
- **Input Validation**: All user inputs must be strictly validated
- **Error Messages**: Do not expose sensitive error information in production
- **HTTPS**: Production deployment must use HTTPS

- **私钥管理**: 永远不要在生产环境中使用明文私钥
- **输入验证**: 所有用户输入都要进行严格验证
- **错误信息**: 生产环境不暴露敏感错误信息
- **HTTPS**: 生产部署必须使用 HTTPS

## 🏗️ Project Structure

## 🏗️ 项目结构

```
simple-dapp/
├── contracts/          # Smart contracts
│   └── SimpleToken.sol
├── scripts/            # Deployment scripts
│   └── deploy.ts
├── src/                # Backend source code
│   └── index.ts
├── public/             # Frontend static files
│   └── index.html
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
├── hardhat.config.ts   # Hardhat configuration
└── README.md          # Project documentation
```

```
simple-dapp/
├── contracts/          # 智能合约
│   └── SimpleToken.sol
├── scripts/            # 部署脚本
│   └── deploy.ts
├── src/                # 后端源码
│   └── index.ts
├── public/             # 前端静态文件
│   └── index.html
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── hardhat.config.ts   # Hardhat 配置
└── README.md          # 项目文档
```

## 🔒 Security Considerations

## 🔒 安全注意事项

⚠️ **Important Reminders**:

⚠️ **重要提醒**：

1. **Private Key Security**: Never use real private keys in test environments
2. **Test Networks**: Only develop on local test networks or testnets
3. **Environment Variables**: Do not commit `.env` files to version control
4. **Production Deployment**: Use appropriate key management services and security measures

1. **私钥安全**: 永远不要将真实私钥用于测试环境
2. **测试网络**: 仅在本地测试网络或测试网上进行开发
3. **环境变量**: 不要将 `.env` 文件提交到版本控制系统
4. **生产部署**: 使用适当的密钥管理服务和安全措施

## 🚀 Deployment Guide

## 🚀 部署指南

### Local Development Environment
### 本地开发环境
```bash
# 1. Install dependencies
yarn install

# 2. Start blockchain network
npx hardhat node

# 3. Compile and deploy contracts
yarn compile-contract
yarn deploy-contract

# 4. Configure environment variables
cp .env.example .env
# Edit .env file, set CONTRACT_ADDRESS

# 5. Start development server
yarn dev
```

```bash
# 1. 安装依赖
yarn install

# 2. 启动区块链网络
npx hardhat node

# 3. 编译和部署合约
yarn compile-contract
yarn deploy-contract

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 CONTRACT_ADDRESS

# 5. 启动开发服务器
yarn dev
```

### Production Environment Deployment
### 生产环境部署

#### Environment Preparation
#### 环境准备
```bash
# Set production environment variables
NODE_ENV=production
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x... # Deployed contract address
PORT=3000
```

```bash
# 设置生产环境变量
NODE_ENV=production
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x... # 部署的合约地址
PORT=3000
```

#### Deploy with PM2
#### 使用 PM2 部署
```bash
# Install PM2
npm install -g pm2

# Build project
yarn build

# Start with PM2
pm2 start dist/index.js --name "simple-dapp"

# Save PM2 configuration
pm2 save
pm2 startup
```

```bash
# 安装 PM2
npm install -g pm2

# 构建项目
yarn build

# 使用 PM2 启动
pm2 start dist/index.js --name "simple-dapp"

# 保存 PM2 配置
pm2 save
pm2 startup
```

#### Docker Deployment
#### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Monitoring and Maintenance
### 监控和维护
- Use `/api/health` endpoint to monitor application status
- View application logs: `pm2 logs simple-dapp`
- Restart application: `pm2 restart simple-dapp`
- Monitor performance metrics: memory usage, response time, etc.

- 使用 `/api/health` 端点监控应用状态
- 查看应用日志：`pm2 logs simple-dapp`
- 重启应用：`pm2 restart simple-dapp`
- 监控性能指标：内存使用、响应时间等

## 🤝 Contributing Guide

## 🤝 贡献指南

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### Commit Standards
### 提交规范
- Use clear commit messages
- Include relevant test cases
- Update documentation to reflect changes
- Follow existing code style

- 使用清晰的提交信息
- 包含相关的测试用例
- 更新文档以反映更改
- 遵循现有的代码风格

## 📄 License

## 📄 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔧 Troubleshooting

## 🔧 故障排除

### Common Issues

### 常见问题

#### Contract Deployment Failed
#### 合约部署失败
```
Error: Contract deployment failed
```
**Solution:**
**解决方案:**
1. Check Hardhat network configuration
2. Ensure local node is running (`npx hardhat node`)
3. Check contract syntax errors

1. 检查 Hardhat 网络配置
2. 确保本地节点正在运行 (`npx hardhat node`)
3. 检查合约语法错误

#### API Request Failed
#### API 请求失败
```
Error: Failed to fetch network info
```
**Solution:**
**解决方案:**
1. Check `RPC_URL` configuration in `.env` file
2. Ensure blockchain node is running
3. Check network connection

1. 检查 `.env` 文件中的 `RPC_URL` 配置
2. 确保区块链节点正在运行
3. 检查网络连接

#### Frontend Cannot Connect to Backend
#### 前端无法连接后端
```
Failed to fetch /api/network
```
**Solution:**
**解决方案:**
1. Confirm backend service is running (`yarn dev`)
2. Check port configuration (default 3000)
3. Check CORS configuration

1. 确认后端服务正在运行 (`yarn dev`)
2. 检查端口配置 (默认 3000)
3. 检查 CORS 配置

#### Token Transfer Failed
#### 代币转账失败
```
Error: Insufficient token balance
```
**Solution:**
**解决方案:**
1. Check sender's token balance
2. Confirm contract address is configured correctly
3. Validate recipient address format

1. 检查发送者代币余额
2. 确认合约地址配置正确
3. 验证接收地址格式

### Debugging Tips
### 调试技巧
- Use browser developer tools to view network requests
- Check server logs: `pm2 logs simple-dapp`
- Use `/api/health` endpoint to check service status
- View detailed error information in development mode

- 使用浏览器开发者工具查看网络请求
- 检查服务器日志：`pm2 logs simple-dapp`
- 使用 `/api/health` 端点检查服务状态
- 在开发模式下查看详细错误信息

## 📚 Learning Resources

## 📚 学习资源

### Official Documentation
### 官方文档
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)

- [Web3.js 文档](https://web3js.readthedocs.io/)
- [Ethers.js 文档](https://docs.ethers.org/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Hardhat 文档](https://hardhat.org/docs)

### Learning Path
### 学习路径
1. **Blockchain Basics**: Understand how blockchain works
2. **Solidity Programming**: Learn smart contract development
3. **Web3.js/Ethers.js**: Master blockchain interaction
4. **Hardhat**: Learn contract testing and deployment
5. **DApp Development**: Build decentralized applications

1. **区块链基础**: 了解区块链工作原理
2. **Solidity 编程**: 学习智能合约开发
3. **Web3.js/Ethers.js**: 掌握区块链交互
4. **Hardhat**: 学习合约测试和部署
5. **DApp 开发**: 构建去中心化应用

### Community Resources
### 社区资源
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)
- [CryptoZombies](https://cryptozombies.io/) - Interactive Solidity tutorial

- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [OpenZeppelin 文档](https://docs.openzeppelin.com/)
- [CryptoZombies](https://cryptozombies.io/) - 交互式 Solidity 教程

## 📈 Version History

## 📈 版本历史

### v1.0.0 (2024-01-XX)
- ✨ Complete ERC-20 token smart contract
- 🚀 Modern frontend interface
- 📊 Real-time network monitoring
- 💰 ETH and token transfer functionality
- 📋 Paginated transaction history queries
- 🧪 Complete unit testing suite
- ⚡ Performance optimization and caching mechanisms
- 🔒 Enhanced security measures

### v1.0.0 (2024-01-XX)
- ✨ 完整的 ERC-20 代币智能合约
- 🚀 现代化前端界面
- 📊 实时网络监控
- 💰 ETH 和代币转账功能
- 📋 分页交易历史查询
- 🧪 完整的单元测试套件
- ⚡ 性能优化和缓存机制
- 🔒 增强的安全措施

### Upcoming Features
### 即将推出
- 🔐 Wallet connection integration (MetaMask)
- 📱 Mobile responsive optimization
- 🌐 Multi-network support
- 📊 Advanced analytics charts
- 🔄 Batch transfer functionality

- 🔐 钱包连接集成 (MetaMask)
- 📱 移动端响应式优化
- 🌐 多网络支持
- 📊 高级分析图表
- 🔄 批量转账功能

## 🙏 Acknowledgments

## 🙏 致谢

Thanks to the following open source projects and communities:

感谢以下开源项目和社区：

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Web3.js](https://web3js.readthedocs.io/) - Ethereum JavaScript API
- [Ethers.js](https://docs.ethers.org/) - Ethereum interaction library
- [Solidity](https://soliditylang.org/) - Smart contract programming language
- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contract library

- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Web3.js](https://web3js.readthedocs.io/) - 以太坊 JavaScript API
- [Ethers.js](https://docs.ethers.org/) - 以太坊交互库
- [Solidity](https://soliditylang.org/) - 智能合约编程语言
- [OpenZeppelin](https://openzeppelin.com/) - 安全智能合约库

Special thanks to the Ethereum community for their contributions to the Web3 ecosystem!

特别感谢 Ethereum 社区为 Web3 生态系统做出的贡献！

---

**🎉 Wish you all the best in your Web3 development journey!**

**🎉 祝您在 Web3 开发之旅中一切顺利！**
