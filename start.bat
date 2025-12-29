@echo off
echo 🚀 启动 Simple DApp...
echo.

echo 📦 安装依赖...
call yarn install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 🔨 编译智能合约...
call yarn compile-contract
if %errorlevel% neq 0 (
    echo ❌ 合约编译失败
    pause
    exit /b 1
)

echo.
echo 🚀 启动 Hardhat 本地网络...
start "Hardhat Node" cmd /c "yarn hardhat node"

echo 等待网络启动...
timeout /t 3 /nobreak > nul

echo.
echo 📋 部署智能合约...
call yarn deploy-contract

echo.
echo 🎯 启动后端服务...
echo 请在新终端窗口运行: yarn dev
echo.
echo 🌐 然后访问: http://localhost:3000
echo.

pause
