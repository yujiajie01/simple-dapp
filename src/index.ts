import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { errorHandler, requestLogger, performanceMonitor, corsOptions } from './middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(performanceMonitor);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API 路由
app.use('/api', apiRoutes);

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// 全局错误处理中间件
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Simple DApp API 服务运行在 http://localhost:${PORT}`);
  console.log(`📋 API 文档: http://localhost:${PORT}/api/health`);
  console.log(`🌐 环境: ${process.env.NODE_ENV || 'development'}`);
});
