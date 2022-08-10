// ~~ Put all the interactions from '../actions/` together to write the final handle function which will be exported
// from the contract source. ~~


import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
import { PstAction, PstResult, PstState,ContractResult} from './types/types';

declare const ContractError;

export async function handle(
  state: PstState,
  action: PstAction
): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'mint':
      return await mintTokens(state, action);
    case 'transfer':
      return await transferTokens(state, action);
    case 'balance':
      return await balance(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`
      );
  }
}
