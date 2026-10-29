# ChainRenter

A peer-to-peer lending (renting) platform on the Ethereum blockchain, built with React and Feathers. People list items, others rent them, and an Ethereum smart contract handles the deposit and payment through each stage of the rental (`transactionModules/StageZero` … `StageSeven`).

> **Status:** personal project, pushed to GitHub in May 2021 (the dependencies date it to about 2019). Not maintained, and shared as-is.

## What's here

- `ChainRenter_frontEnd/`: the React app (Create React App). It talks to a Feathers backend over socket.io (`src/feathers.js`) and to the contracts through web3/truffle-contract, using the compiled artifacts in `src/contracts/` (`Chainrenter.json`, `Ecommerce.json`).
- **The backend isn't included.** `ChainRenter_backEnd` was a submodule reference with no URL, so its code (the Feathers server and the Solidity sources) was never part of this repo.

## Running the front end

This needs old tooling: Node 10–12 era, react-scripts 3, web3 1.0 beta. Newer Node versions will probably need `NODE_OPTIONS=--openssl-legacy-provider`, or won't work at all.

```
cd ChainRenter_frontEnd
npm install
npm run start
```

It expects a Feathers server on the same origin (see `src/feathers.js`) and MetaMask connected to a network where the contracts are deployed. Without the backend, the UI loads but has no data.

## Notes

- Files named `NOTUSED_*`, `backupitemlist.js` and `TransactionDetailsTry.js` are leftovers from development. They're kept so the project stays as it was.
