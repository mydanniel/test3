import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
// ~~ Write function responsible for adding funds to the generated wallet ~~
export async function addFunds(arweave: Arweave, wallet: JWKInterface) {
    const walletAddress = await arweave.wallets.getAddress(wallet);
    await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);
  }

// ~~ Write function responsible for mining block on the Arweave testnet ~~
export async function mineBlock(arweave: Arweave) {
    await arweave.api.get('mine');
  }
