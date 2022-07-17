import { InjectedConnector } from "wagmi/connectors/injected";
class BitkeepConnector extends InjectedConnector {
    constructor({ chains = [], options_ = {} }) {
      const options = {
        name: "BitKeep",
        ...options_,
      };
      super({ chains, options });
  
      this.id = "Bitkeep";
      this.ready = typeof window != "undefined" && !!this.findProvider(window?.bitkeep?.ethereum);
    }
    async getProvider() {
      if (typeof window !== "undefined") {
        // TODO: Fallback to `ethereum#initialized` event for async injection
        // https://github.com/BitKeep/detect-provider#synchronous-and-asynchronous-injection=
        this.provider = window.bitkeep?.ethereum;
      }
      return this.provider;
    }
    getReady(ethereum) {
      if (!ethereum.isBitKeep || !ethereum) return;
      // Brave tries to make itself look like BitKeep
      // Could also try RPC `web3_clientVersion` if following is unreliable
      if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) return;
      if (ethereum.isTokenPocket) return;
      if (ethereum.isTokenary) return;
      return ethereum;
    }
    findProvider(ethereum) {
      if (ethereum?.providers) return ethereum.providers.find(this.getReady);
      return this.getReady(ethereum);
    }
  }

  export default BitkeepConnector