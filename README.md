1.issue nft on uptick chain

yarn issueNFT:my
-------------------------------------------------------------------------
$ npx hardhat run scripts/issueNFT.js --network uptick
chainID is :82
0x0cE380044B8F8b58D9c852901Be556F4111E14c6
-------------------------------------------------------------------------

ref:
export NFTID=20 && yarn getNFT:uptick


2.preRun
https://chainbridge.chainsafe.io/live-evm-bridge/

2.1  Deploy contracts on Source
yarn 1

-------------------------------------------------------------------------
chainID                 82
deployer                account[0]
Bridge.address          0x3d0c8f888B582B62841624087Bc7de43bea303c2
ERC20Handler.address    0x0b51085C773735C9e2310f7F44Bd9A139213785d
ERC721Handler.address   0x630f4539FCE40C8Fd16aFD8f92710EC6825B3870
-------------------------------------------------------------------------

2.2  Configure contracts on Source
-------------------------------------------------------------------------
chainID                 82
deployer                account[0]
bridge                  0x1Bc53911A664c0DaBDf7E8B52133699C4346CB3a
handler                 0x99e42D431147540D09D2651eB3380e7ef49eD55e
targetContract          0x375983604B3142ec11c0ad5c5a53605cf1c19C5A
tx                      0xa4783cd4fb0b9eae2d2816a2f3c1d063c37997110ee0995d69a429d308d66551
-------------------------------------------------------------------------

2.3 Deploy contracts on Destination (Kovan)
-------------------------------------------------------------------------
chainID                 42
deployer                account[1]
Bridge.address          0x1Bc53911A664c0DaBDf7E8B52133699C4346CB3a
ERC20Handler.address    0xB562ccF5784bcD2518BB3bcbf89d0eE12D613ca6
ERC721Handler.address   0x99e42D431147540D09D2651eB3380e7ef49eD55e
-------------------------------------------------------------------------


func (w *writer) ResolveMessage(m msg.Message) bool {