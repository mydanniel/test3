# Initial state

Core parts of every SmartWeave contract are contract source and initial state. They are posted to the Arweave blockchain as transactions.

Let's start with initial state.

## 📃 PstState

To obtain good structure we will use the power of Typescript and prepare some types first. Head to [warp-academy-pst/challenge/src/contracts/types/types.ts](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/types/types.ts) and let's start writing!

```js
export interface PstState {
  ticker: string;
  name: string;
  owner: string;
  balances: {
    [address: string]: number,
  };
}
```

Time for explanation.

`PstState` represents the contract's current state. Its shape is not defined by any rules and it is the developer who decides what the state will look like. In case of our implementation it will consist of four properties:

- `ticker` - an abbreviation used to uniquely identify the token.
- `name` - name of the token.
- `owner` - owner of the contract.
- `balances` - object with all the addresses possessing tokens and their balances.

## 📁 Initial state file

Now we have it typed, we can write the initial state for our contract. Head to [warp-academy-pst/challenge/src/contracts/initial-state.json](https://github.com/warp-contracts/academy/tree/main/warp-academy-pst/challenge/src/contracts/initial-state.json) and write the initial state for your contract. Remember - it has to be a json file. We will stick to the types we have already written and here is just a sample of what it can look like. You can copy it or change some of the fields (e.g. `balances` object). For the purpose of the tutorial we will just mock the addresses.

```json
{
  "ticker": "FC",
  "name": "Federation Credits",
  "owner": "GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI",
  "balances": {
    "GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI": 1000,
    "33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA": 230
  }
}
```

And that's it! We are halfway to writing our first contract. Now, let's play a bit with the contract source.
