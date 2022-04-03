# DBook.Solidity

DBook uses Solidity smart contracts to enable transfers to and from EVM compatible chains. These contracts consist of a core platform contract (DBookPlatform.sol) and a nft assect contract(DBook1155.sol). The platform contract is responsible for issue nft and trade. The nft asset are used by the platform contract to mint nft asset(erc1155).



## Dependencies

Requires `nodejs` ,`yarn` and `npm`.

## Commands

`yarn install`: Installs hardhat and ganache globally, fetches local dependencies. 

`make test`: Runs hardhat tests.

`make compile`: Compile contracts.


# DBook Security Policy

## DBook a Security Bug

We take all security issues seriously, if you believe you have found a security issue within a DBook
project please notify us immediately. If an issue is confirmed, we will take all necessary precautions 
to ensure a statement and patch release is made in a timely manner.

Please email us a description of the flaw and any related information (e.g. reproduction steps, version) to
[security at xuxinlai2002](mailto:xuxinlai2002@gmail.com).
