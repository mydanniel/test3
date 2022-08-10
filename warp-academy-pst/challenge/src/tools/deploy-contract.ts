import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { ArWallet, WarpNodeFactory } from 'warp-contracts';
import jwk from '../../.secrets/jwk.json';


(async () => {
// ~~ Declare variables ~~

// ~~ Initialize Arweave ~~
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
// ~~ Initialize `LoggerFactory` ~~

// ~~ Initialize Warp ~~
const warp = WarpNodeFactory.memCached(arweave);
// ~~ Read contract source and initial state files ~~
const contractSrc = fs.readFileSync(
    path.join(__dirname, '../../dist/contract.js'),
    'utf8'
  );
  const initialState = fs.readFileSync(
    path.join(__dirname, '../../dist/contracts/initial-state.json'),
    'utf8'
  );
// ~~ Deploy contract ~~
console.log('Deployment started');
  const contractTxId = await warp.createContract.deploy({
    wallet: jwk as ArWallet,
    initState: initialState,
    src: contractSrc,
  });
// ~~ Log contract id to the console ~~
console.log('Deployment completed: ' + contractTxId);

})();
