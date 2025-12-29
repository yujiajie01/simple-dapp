import { ethers } from "hardhat";

async function main() {
  console.log("开始部署 SimpleToken 合约...");

  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const SimpleToken = await ethers.getContractFactory("SimpleToken");
  const token = await SimpleToken.deploy(1000000); // 初始供应量：100万代币

  await token.waitForDeployment();

  const contractAddress = await token.getAddress();
  console.log("SimpleToken 合约部署成功!");
  console.log("合约地址:", contractAddress);
  console.log("初始供应量:", await token.totalSupply());

  // 保存合约地址到环境变量提示
  console.log("\n请将以下地址添加到 .env 文件中的 CONTRACT_ADDRESS:");
  console.log(contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });
