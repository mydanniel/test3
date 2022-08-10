import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { PstState } from '../contracts/types/types';
import { LoggerFactory, PstContract, Warp, WarpNodeFactory } from 'warp-contracts';
import fs from 'fs';
import path from 'path';
import { addFunds, mineBlock } from '../../utils/_helpers';


let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: PstState;

let arweave: Arweave;
let warp: Warp;

(async () => {
// ~~ Declare variables ~~

// ~~ Initialize Arweave ~~
arweave = Arweave.init({
    host: 'testnet.redstone.tools',
    port: 443,
    protocol: 'https',
  });

// ~~ Initialize `LoggerFactory` ~~
LoggerFactory.INST.logLevel('error');
// ~~ Initialize Warp ~~
warp = WarpNodeFactory.memCached(arweave);
// ~~ Generate wallet and add some funds ~~
wallet = await arweave.wallets.generate();
walletAddress = await arweave.wallets.jwkToAddress(wallet);
await addFunds(arweave, wallet);
// ~~ Read contract source and initial state files ~~
contractSrc = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8'
  );
  const stateFromFile: PstState = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../dist/contracts/initial-state.json'),
      'utf8'
    )
  );
// ~~ Override contract's owner address with the generated wallet address ~~
initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
    },
  };
// ~~ Deploy contract ~~
const contractTxId = await warp.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  
// ~~ Log contract id to the console ~~
console.log(contractTxId);

//Mine block
await mineBlock(arweave);

})();
