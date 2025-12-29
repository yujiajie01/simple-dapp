const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let SimpleToken;
  let simpleToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const initialSupply = ethers.parseEther("1000000"); // 1 million tokens

  beforeEach(async function () {
    // 获取合约工厂和签名者
    SimpleToken = await ethers.getContractFactory("SimpleToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // 部署合约
    simpleToken = await SimpleToken.deploy(initialSupply);
    await simpleToken.waitForDeployment();
  });

  describe("部署", function () {
    it("应该设置正确的初始供应量", async function () {
      expect(await simpleToken.totalSupply()).to.equal(initialSupply);
    });

    it("应该将初始供应量分配给部署者", async function () {
      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("应该设置正确的代币信息", async function () {
      expect(await simpleToken.name()).to.equal("Simple Token");
      expect(await simpleToken.symbol()).to.equal("STK");
      expect(await simpleToken.decimals()).to.equal(18);
    });

    it("应该设置正确的合约拥有者", async function () {
      expect(await simpleToken.owner()).to.equal(owner.address);
    });
  });

  describe("转账功能", function () {
    it("应该允许有效转账", async function () {
      const transferAmount = ethers.parseEther("100");

      await expect(simpleToken.transfer(addr1.address, transferAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);

      expect(await simpleToken.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialSupply - transferAmount);
    });

    it("应该在余额不足时拒绝转账", async function () {
      const transferAmount = ethers.parseEther("2000000"); // 超过总供应量

      await expect(simpleToken.connect(addr1).transfer(addr2.address, transferAmount))
        .to.be.revertedWith("Insufficient balance");
    });

    it("应该在转账到零地址时正常执行", async function () {
      const transferAmount = ethers.parseEther("100");

      await expect(simpleToken.transfer(ethers.ZeroAddress, transferAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, transferAmount);

      expect(await simpleToken.balanceOf(ethers.ZeroAddress)).to.equal(transferAmount);
    });
  });

  describe("铸造功能", function () {
    it("应该允许合约拥有者铸造代币", async function () {
      const mintAmount = ethers.parseEther("50000");

      await expect(simpleToken.mint(addr1.address, mintAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);

      expect(await simpleToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await simpleToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("应该拒绝非拥有者铸造代币", async function () {
      const mintAmount = ethers.parseEther("50000");

      await expect(simpleToken.connect(addr1).mint(addr2.address, mintAmount))
        .to.be.revertedWith("Only owner can call this function");
    });

    it("应该拒绝铸造到零地址", async function () {
      const mintAmount = ethers.parseEther("50000");

      await expect(simpleToken.mint(ethers.ZeroAddress, mintAmount))
        .to.be.revertedWith("Cannot mint to zero address");
    });
  });

  describe("销毁功能", function () {
    it("应该允许销毁代币", async function () {
      const burnAmount = ethers.parseEther("10000");

      await expect(simpleToken.burn(burnAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);

      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialSupply - burnAmount);
      expect(await simpleToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("应该在余额不足时拒绝销毁", async function () {
      const burnAmount = ethers.parseEther("2000000"); // 超过余额

      await expect(simpleToken.burn(burnAmount))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("授权转账", function () {
    const approveAmount = ethers.parseEther("500");
    const transferAmount = ethers.parseEther("200");

    beforeEach(async function () {
      await simpleToken.approve(addr1.address, approveAmount);
    });

    it("应该正确设置授权额度", async function () {
      expect(await simpleToken.allowance(owner.address, addr1.address)).to.equal(approveAmount);
    });

    it("应该发出Approval事件", async function () {
      await expect(simpleToken.approve(addr1.address, approveAmount))
        .to.emit(simpleToken, "Approval")
        .withArgs(owner.address, addr1.address, approveAmount);
    });

    it("应该允许授权转账", async function () {
      await expect(simpleToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, addr2.address, transferAmount);

      expect(await simpleToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialSupply - transferAmount);
      expect(await simpleToken.allowance(owner.address, addr1.address)).to.equal(approveAmount - transferAmount);
    });

    it("应该在授权额度不足时拒绝转账", async function () {
      const excessiveAmount = ethers.parseEther("1000");

      await expect(simpleToken.connect(addr1).transferFrom(owner.address, addr2.address, excessiveAmount))
        .to.be.revertedWith("Insufficient allowance");
    });

    it("应该在发送者余额不足时拒绝转账", async function () {
      // 首先转移所有代币到addr1
      await simpleToken.transfer(addr1.address, initialSupply);

      await expect(simpleToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("所有权转让", function () {
    it("应该允许当前拥有者转让所有权", async function () {
      await expect(simpleToken.transferOwnership(addr1.address))
        .to.emit(simpleToken, "OwnershipTransferred")
        .withArgs(owner.address, addr1.address);

      expect(await simpleToken.owner()).to.equal(addr1.address);
    });

    it("应该拒绝非拥有者转让所有权", async function () {
      await expect(simpleToken.connect(addr1).transferOwnership(addr2.address))
        .to.be.revertedWith("Only owner can call this function");
    });

    it("应该拒绝转让所有权给零地址", async function () {
      await expect(simpleToken.transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWith("New owner cannot be zero address");
    });

    it("新拥有者应该能够铸造代币", async function () {
      await simpleToken.transferOwnership(addr1.address);

      const mintAmount = ethers.parseEther("1000");
      await expect(simpleToken.connect(addr1).mint(addr2.address, mintAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(ethers.ZeroAddress, addr2.address, mintAmount);
    });
  });

  describe("边界情况", function () {
    it("应该正确处理大数值转账", async function () {
      const largeAmount = ethers.parseEther("500000");

      await expect(simpleToken.transfer(addr1.address, largeAmount))
        .to.emit(simpleToken, "Transfer")
        .withArgs(owner.address, addr1.address, largeAmount);

      expect(await simpleToken.balanceOf(addr1.address)).to.equal(largeAmount);
    });

    it("应该正确处理多次转账", async function () {
      const amounts = [
        ethers.parseEther("10000"),
        ethers.parseEther("25000"),
        ethers.parseEther("5000")
      ];

      for (const amount of amounts) {
        await simpleToken.transfer(addr1.address, amount);
      }

      const totalTransferred = amounts.reduce((sum, amount) => sum + amount, 0n);
      expect(await simpleToken.balanceOf(addr1.address)).to.equal(totalTransferred);
      expect(await simpleToken.balanceOf(owner.address)).to.equal(initialSupply - totalTransferred);
    });
  });
});
