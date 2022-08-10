# Execution

We will write a couple of tests which will help us understand some basics about interacting with the contract. After writing each test you should run the correct script from the previous section (node or browser one) to see if it works correctly.

## ⚖️ Current state and current balance

Let's start with reading the contract's state. Add the following code to `should read pst state and balance data` test. If you've set other addresses or balances in the initial state you will of course need to change them accordingly.

```js
expect(await pst.currentState()).toEqual(initialState);
expect(
  (await pst.currentBalance('GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI'))
    .balance
).toEqual(1000);
expect(
  (await pst.currentBalance('33F0QHcb22W7LwWR1iRC8Az1ntZG09XQ03YWuw2ABqA'))
    .balance
).toEqual(230);
```

We are using SDK's `currentState` method which reads the current state of our contract. We are also using PST's specific method - `currentBalance` which takes the target wallet as an argument and read its current balance. Underneath, it simply returns the "view" of the state, computed by the Warp - ie. the object that is a derivative of a current state and some specific smart contract business logic. Remember when we were writing actions possible to make with our contract in the contract source? This is where we see it in action!

## 💰 Minting tokens - write interaction

Let's move to the next test. Add the following code to `should properly mint tokens` test.

```ts
await pst.writeInteraction({
  function: 'mint',
  qty: 2000,
});

await mineBlock(arweave);
expect((await pst.currentState()).balances[walletAddress]).toEqual(2000);
```

We are using SDK's `writeInteraction` method which creates, signs and posts transactions with specific input to Arweave and returns a transaction id. We will call the mint function which should mint specific amount of FC tokens to the previously generated caller's wallet.

As we posted a transaction which changes the contract's state, we need to mine a block by using the `mineBlock` function and read contract state to verify if `mint` function has correctly updated the state and minted some tokens to the caller's wallet.

## 💸 Transfering tokens

Let's test the core contract function - `transfer`. It should correctly subtract an indicated amount of tokens from the caller's wallet and add it to the target wallet. Here we can usea  dedicated PST method - `transfer` which calls the `transfer` function by using the `writeInteraction` method. We will then, again, mine a block and check the contract's state after the change. Add the following code to `should properly transfer tokens` test.

```js
await pst.transfer({
  target: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
  qty: 555,
});

await mineBlock(arweave);

expect((await pst.currentState()).balances[walletAddress]).toEqual(
  2000 + 333 - 555
);
expect(
  (await pst.currentState()).balances[
    'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI'
  ]
).toEqual(1000 + 555);
```

## 🏜️ Dry-writes

One last test to write. It will introduce us to the SDK's method - `dryWrite`. It loads the contract state, creates a 'dummy' transaction and applies the given input on top of the current contract's state. This way, you can verify how a specific interaction will result before posting it to Arweave. You can view its API [here](https://github.com/warp-contracts/warp/blob/main/src/contract/Contract.ts). We will pass optional parameter - caller's address - which will override the caller evaluated from the wallet connected to the contract.
Write following code in `should properly perform dry write with overwritten caller` test.

```js
    const newWallet = await arweave.wallets.generate();
    const overwrittenCaller = await arweave.wallets.jwkToAddress(newWallet);
    await pst.transfer({
      target: overwrittenCaller,
      qty: 1000,
    });

    await mineBlock(arweave);

    const result: InteractionResult<PstState, unknown> = await pst.dryWrite(
      {
        function: 'transfer',
        target: 'GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI',
        qty: 333,
      },
      overwrittenCaller
    );

    expect(result.state.balances[walletAddress]).toEqual(
      2000 + 333 - 555 - 1000
    );
    expect(
      result.state.balances['GH2IY_3vtE2c0KfQve9_BHoIPjZCS8s5YmSFS_fppKI']
    ).toEqual(1000 + 555 + 333);
    expect(result.state.balances[overwrittenCaller]).toEqual(1000 - 333);
  });
```

## 🎊 Conclusion

We have just learned some key SmartWeave concepts. We have also ascertained that our contract will work correctly. We are ready to deploy the contract!
