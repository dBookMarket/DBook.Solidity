require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('@openzeppelin/hardhat-upgrades')
require('hardhat-deploy')

module.exports = {
  networks: {
    test: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      accounts: [
        "0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5",
        "0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",
        "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",
        "0x06f8fb3c6251f0491e2e7abc40f33ae601eaeeb3de444f77d5a5774149ff22a2",
        "0x64cbfcd7052f3ce2e1160e73370fd4f5e8a087d749d687c2695a92e9a6fa6ed8",
      ]
    },
    

    hardhat: {
      chainId:100,
      accounts: [
        {privateKey:"0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5",balance:"10000000000000000000000"},
        {privateKey:"0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",balance:"10000000000000000000000"},
        {privateKey:"0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",balance:"10000000000000000000000"},
        {privateKey:"0x06f8fb3c6251f0491e2e7abc40f33ae601eaeeb3de444f77d5a5774149ff22a2",balance:"10000000000000000000000"},
        {privateKey:"0x64cbfcd7052f3ce2e1160e73370fd4f5e8a087d749d687c2695a92e9a6fa6ed8",balance:"10000000000000000000000"}
      ]
    },

    hyperspace: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: [
        "84dd3e2533549287cdab95904c7929c5b7dde2b941c87ebf8c93812c6c61cfe3",
        "3338d1eb41b6ab37a92f76a46e268675b0f10604ac8d6bf3ca025cd1cb66222f",
        "c03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5"
      ],
    },

  },
  solidity: '0.6.6',
  namedAccounts: {
    deployer: 0
  },
}
