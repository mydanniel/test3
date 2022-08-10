import Vue from 'vue';
import Vuex from 'vuex';
import { arweave, warp } from '../pst-contract';
import { deployedContracts } from '../deployed-contracts';
import { PstState } from '@/contracts/types/types';
import { Contract } from 'warp-contracts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    arweave,
    warp,
    state: {},
    validity: {},
    contract: null,
    walletAddress: null,
  },
  mutations: {
    setState(state, swState) {
      state.state = swState;
    },
    setValidity(state, validity) {
      state.validity = validity;
    },
    setContract(state, contract) {
      state.contract = contract;
    },
    setWalletAddress(state, walletAddress) {
      state.walletAddress = walletAddress;
    },
  },
  actions: {
    async loadState({ commit }) {
      // ~~ Generate arweave wallet ~~
      const wallet = await arweave.wallets.generate();
      // ~~ Get wallet address and mint some tokens ~~
      const walletAddress = await arweave.wallets.getAddress(wallet);
      await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);


      // ~~ Connect deployed contract and wallet ~~
      const contract: Contract = warp
      .pst(deployedContracts.fc)
      .connect(wallet);
      commit('setContract', contract);

      // ~~ Set the state of the contract ~~
      const { state, validity } = await contract.readState();
      commit('setState', state);
      commit('setValidity', validity);
      commit('setWalletAddress', walletAddress);
    },
  },
  modules: {},
});
