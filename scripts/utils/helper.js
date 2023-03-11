const fs = require('fs')
const path = require('path')
// const { ethers,upgrades } = require("hardhat");
require("hardhat-deploy")
require("hardhat-deploy-ethers")


const writeConfig = async (fromFile,toFile,key, value) => {

    let fromFullFile = getPath(fromFile);
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
    data[key] = value;

    let toFullFile = getPath(toFile);
    fs.writeFileSync(toFullFile, JSON.stringify(data, null, 4), { encoding: 'utf8' }, err => {})

}

const readConfig = async (fromFile,key) => {

    let fromFullFile = getPath(fromFile);
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
   
    return data[key];

}

function getPath(fromFile){
    return  path.resolve(__dirname, '../config/' + fromFile + '.json');
}

const log = (msg) => console.log(`${msg}`)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//
let gasPrice = 0x02540be400;
let gasLimit = 0x7a1200;

//0 USDT
async function deployERC20(name,symbol,amount,account){

    const dErc20Factory = await ethers.getContractFactory("MockERC20",account);
    const dErc20Contract = await dErc20Factory.deploy(
        name,symbol,amount
    )
    await dErc20Contract.deployed()
    
    return dErc20Contract;

}

async function attachERC20(account,address){

    const dErc20Factory = await ethers.getContractFactory("MockERC20",account);
    const dErc20Contract = await dErc20Factory.attach(
        address,
        { gasPrice: gasPrice, gasLimit: gasLimit}
    )
    return dErc20Contract;

}

//1 DBOOK
async function deployDBook1155(name,symbol,data,account){

    const dBook1155Factory = await ethers.getContractFactory("DBook1155",account);
    const dBookContract = await dBook1155Factory.deploy(
        name,symbol,data
    )
    await dBookContract.deployed()

    return dBookContract;

}

async function attachDBook1155(account,address){

    const dBook1155Factory = await ethers.getContractFactory("DBook1155",account);
    const dBook1155Contract = await dBook1155Factory.attach(
        address,
        { gasPrice: gasPrice, gasLimit: gasLimit}
    )
    return dBook1155Contract;

}

//2 dbook platform
async function deployDBookPlatform(token1155Address,token20Address,version,account){

    const dDBookPlatformFactory = await ethers.getContractFactory("DBookPlatform",account);
    const dDBookPlatformContract = await upgrades.deployProxy(
        dDBookPlatformFactory,
        [
            token1155Address,token20Address,version
        ],
        {
            initializer: "__DBookPlatform_init",
            unsafeAllowLinkedLibraries: true,
        }
    );
    await dDBookPlatformContract.deployed()

    return dDBookPlatformContract;

}

async function attachDBookPlatform(account,address){

    const dDBookPlatformFactory = await ethers.getContractFactory("DBookPlatform",account);
    const dDBookPlatformContract = await dDBookPlatformFactory.attach(
        address,
        { gasPrice: gasPrice, gasLimit: gasLimit}
    )
    return dDBookPlatformContract;

}

async function showUsdcBalace(dUsdcContract,prefix){

    [ admin,platform,seller,publisher,buyer] = await ethers.getSigners()
    let _prefix = prefix + " usdc";
    let addressList = [admin.address,platform.address,seller.address,publisher.address,buyer.address];
    let headerInfoList = ["admin","platform","seller","publisher","buyer"]
    await showBalaceFromAddressList(dUsdcContract,addressList,headerInfoList,_prefix);

}


async function showBalaceFromAddressList(erc20Contract,addressList,headerInfoList,prefix){

    for(var i = 0 ;i < addressList.length; i++ ){
        let balance = await erc20Contract.balanceOf(addressList[i]) / 1000000;
        console.log(prefix + " " + headerInfoList[i] + " balance is :  " + balance);

    }

}

async function showNftBalace(dBookContract,prefix,nftId){

    [ admin,platform,seller,publisher,buyer] = await ethers.getSigners()
    let _prefix = prefix + " nftId : " + nftId;
    let addressList = [admin.address,platform.address,seller.address,publisher.address,buyer.address];
    let headerInfoList = ["admin","platform","seller","publisher","buyer"]
    await showNftFromAddressList(dBookContract,addressList,headerInfoList,_prefix,nftId);

}

async function showNftFromAddressList(nftContract,addressList,headerInfoList,prefix,nftId){

    for(var i = 0 ;i < addressList.length; i++ ){
        let balance = await nftContract.balanceOf(addressList[i],nftId);
        console.log(prefix + " " + headerInfoList[i] + " balance is :  " + balance);

    }

}

module.exports = {
    writeConfig,
    readConfig, 
    sleep,
    log,

    deployERC20,
    deployDBook1155,
    deployDBookPlatform,

    attachERC20,
    attachDBook1155,
    attachDBookPlatform,

    showBalaceFromAddressList,
    showUsdcBalace,

    showNftFromAddressList,
    showNftBalace

}