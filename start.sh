#!/bin/bash

echo "🚀 启动 Simple DApp..."
echo

echo "📦 安装依赖..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo
echo "🔨 编译智能合约..."
yarn compile-contract
if [ $? -ne 0 ]; then
    echo "❌ 合约编译失败"
    exit 1
fi

echo
echo "🚀 启动 Hardhat 本地网络..."
yarn hardhat node &
HARDHAT_PID=$!

echo "等待网络启动..."
sleep 3

echo
echo "📋 部署智能合约..."
yarn deploy-contract

echo
echo "🎯 启动后端服务..."
echo "请在新终端窗口运行: yarn dev"
echo
echo "🌐 然后访问: http://localhost:3000"
echo
echo "按 Ctrl+C 停止 Hardhat 网络"

# 等待用户中断
trap "echo '停止 Hardhat 网络...'; kill $HARDHAT_PID 2>/dev/null; exit" INT
wait $HARDHAT_PID
