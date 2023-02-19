const { ethers } = require('hardhat')
// require("hardhat-deploy")
// require("hardhat-deploy-ethers")


const {
    deployERC20,
    writeConfig
} = require('./utils/helper')

const main = async () => {

    //
    const chainId = network.config.chainId
    const wallet = new ethers.Wallet(network.config.accounts[0], ethers.provider)


    console.log("wallet is : " ,wallet.address,network.config.chainId);


    // [admin,platform,seller,publisher,buyer] = await ethers.getSigners()

    // //deploy USDC
    let totalSupply = "100000000000000";
    dUsdcContract = await deployERC20("USDC","USDC",totalSupply,6,wallet);
    let buyAmount = "10000000000"

    console.log("dUsdcContract address : " + dUsdcContract.address);

    
    await dUsdcContract.transfer(buyer.address,buyAmount);

    console.log("usdc contract address : " + dUsdcContract.address);
    await writeConfig(0,0,"USDC_ADDRESS",dUsdcContract.address);
  




}



main();

