# Simple DApp - Node.js Web3 代币应用

<div align="center">

[![English](https://img.shields.io/badge/English-007acc?style=flat-square&logo=github)](README.md)

</div>

一个基于 Node.js + TypeScript 的简单去中心化应用（DApp），包含 ERC-20 代币合约和完整的后端 API。

## 🚀 功能特性

### 核心功能
- ✅ **ERC-20 代币智能合约** - 完整的代币实现，支持转账、授权等标准功能
- ✅ **代币铸造和转账** - 安全的代币铸造和转账操作
- ✅ **ETH 转账功能** - 原生以太坊转账支持
- ✅ **余额查询** - 实时查询 ETH 和代币余额
- ✅ **交易历史查询** - 分页查询交易历史记录
- ✅ **网络信息查看** - 实时网络状态监控

### 用户体验
- ✅ **美观的前端界面** - 现代化响应式设计
- ✅ **实时表单验证** - 智能输入验证和错误提示
- ✅ **加载状态指示** - 友好的用户反馈
- ✅ **复制到剪贴板** - 一键复制地址和交易哈希
- ✅ **通知系统** - 实时操作状态反馈

### 技术特性
- ✅ **高性能缓存** - 智能缓存提升响应速度
- ✅ **并发处理** - 优化并发请求性能
- ✅ **错误处理** - 完善的错误处理机制
- ✅ **TypeScript 支持** - 完整的类型安全
- ✅ **单元测试** - 全面的智能合约测试
- ✅ **代码分层** - 清晰的架构设计

## 🛠️ 技术栈

- **后端**: Node.js + TypeScript + Express
- **区块链**: Solidity + Hardhat + Web3.js + Ethers.js
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **测试网**: Hardhat 本地网络

## 📦 安装依赖

```bash
# 使用 yarn 安装依赖
yarn install

# 或使用 npm
npm install
```

## ⚙️ 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 配置 `.env` 文件：
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

## 🚀 运行应用

### 1. 启动本地区块链网络
```bash
# 终端 1: 启动 Hardhat 本地网络
npx hardhat node
```

### 2. 编译和部署智能合约
```bash
# 终端 2: 编译合约
yarn compile-contract

# 部署合约
yarn deploy-contract
```

部署成功后，将合约地址复制到 `.env` 文件中的 `CONTRACT_ADDRESS`。

### 3. 启动后端服务
```bash
# 终端 3: 启动开发服务器
yarn dev
```

### 4. 访问应用
打开浏览器访问：http://localhost:3000

## 📋 API 接口文档

- `GET /api/health` - 健康检查接口
- `GET /api/network` - 获取网络信息（带缓存）
- `GET /api/balance/:address` - 查询账户余额
- `POST /api/transfer/eth` - ETH 转账
- `POST /api/transfer/token` - 代币转账
- `GET /api/token/info` - 获取代币信息（带缓存）
- `GET /api/transactions/:address` - 获取交易历史（支持分页）

## 🧪 测试说明

```bash
# 运行所有合约测试
yarn test-contract

# 查看测试覆盖率
npx hardhat coverage
```

### 默认账户
Hardhat 本地网络提供 20 个预资金账户：

- **账户 0**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **私钥**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **余额**: 10000 ETH

## 🛠️ 开发指南

### 项目架构
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

### 代码规范
- **智能合约**: 使用 Solidity ^0.8.19，遵循 ERC-20 标准
- **后端 API**: TypeScript 严格模式，统一响应格式
- **前端界面**: 现代 CSS，响应式设计，表单验证

### 性能优化
- **缓存策略**: 网络信息缓存 30 秒，代币信息缓存 5 分钟
- **并发处理**: 使用 Promise.all 进行并行请求
- **分页查询**: 交易历史支持分页，避免大数据量

### 安全注意事项
- **私钥管理**: 永远不要在生产环境中使用
- **输入验证**: 所有用户输入都要严格验证
- **错误信息**: 生产环境不暴露敏感错误信息

## 🏗️ 项目结构

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

## 🔒 安全注意事项

⚠️ **重要提醒**：

1. **私钥安全**: 永远不要将真实私钥用于测试环境
2. **测试网络**: 仅在本地测试网络或测试网上进行开发
3. **环境变量**: 不要将 `.env` 文件提交到版本控制系统
4. **生产部署**: 使用适当的密钥管理服务和安全措施

## 🚀 部署指南

### 本地开发环境
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

### 生产环境部署
```bash
# 安装 PM2
npm install -g pm2

# 构建项目
yarn build

# 使用 PM2 启动
pm2 start dist/index.js --name "simple-dapp"
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范
- 使用清晰的提交信息
- 包含相关的测试用例
- 更新文档以反映更改
- 遵循现有的代码风格

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔧 故障排除

### 常见问题
- **合约部署失败**: 检查 Hardhat 网络配置
- **API 请求失败**: 检查 RPC_URL 配置
- **代币转账失败**: 检查发送者余额和合约地址

### 调试技巧
- 使用浏览器开发者工具查看网络请求
- 检查服务器日志：`pm2 logs simple-dapp`
- 使用 `/api/health` 端点检查服务状态

## 📚 学习资源

### 官方文档
- [Web3.js 文档](https://web3js.readthedocs.io/)
- [Ethers.js 文档](https://docs.ethers.org/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Hardhat 文档](https://hardhat.org/docs)

### 学习路径
1. **区块链基础**: 了解区块链工作原理
2. **Solidity 编程**: 学习智能合约开发
3. **Web3.js/Ethers.js**: 掌握区块链交互
4. **Hardhat**: 学习合约测试和部署
5. **DApp 开发**: 构建去中心化应用

## 📈 版本历史

### v1.0.0 (2024-01-XX)
- ✨ 完整的 ERC-20 代币智能合约
- 🚀 现代化前端界面
- 📊 实时网络监控
- 💰 ETH 和代币转账功能
- 📋 分页交易历史查询
- 🧪 完整的单元测试套件
- ⚡ 性能优化和缓存机制
- 🔒 增强的安全措施

### 即将推出
- 🔐 钱包连接集成 (MetaMask)
- 📱 移动端响应式优化
- 🌐 多网络支持

## 🙏 致谢

感谢以下开源项目和社区：

- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Web3.js](https://web3js.readthedocs.io/) - 以太坊 JavaScript API
- [Ethers.js](https://docs.ethers.org/) - 以太坊交互库
- [Solidity](https://soliditylang.org/) - 智能合约编程语言
- [OpenZeppelin](https://openzeppelin.com/) - 安全智能合约库

特别感谢 Ethereum 社区为 Web3 生态系统做出的贡献！

---

**🎉 祝您在 Web3 开发之旅中一切顺利！**
