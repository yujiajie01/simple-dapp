import express from 'express';

// 全局错误处理中间件
export const errorHandler = (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

// 请求日志中间件
export const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';

    console.log(`${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}${resetColor} - ${duration}ms`);

    // 性能警告
    if (duration > 5000) {
      console.warn(`⚠️ 慢请求警告: ${req.method} ${req.originalUrl} 耗时 ${duration}ms`);
    }
  });

  next();
};

// 性能监控中间件
export const performanceMonitor = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1000000; // 转换为毫秒

    // 记录性能指标
    if (durationMs > 1000) {
      console.log(`🐌 性能监控: ${req.method} ${req.originalUrl} - ${durationMs.toFixed(2)}ms`);
    }
  });

  next();
};

// CORS 选项中间件
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || false
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};
