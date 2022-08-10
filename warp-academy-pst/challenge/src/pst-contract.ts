
import Arweave from 'arweave';
import {
    PstContract,
    PstState,
    Warp,
    WarpNodeFactory,
    LoggerFactory,
    InteractionResult,
    WarpWebFactory
  } from 'warp-contracts';

export const arweave: Arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
  
  export const warp: Warp = WarpWebFactory.memCachedBased(arweave).useArweaveGateway().build();