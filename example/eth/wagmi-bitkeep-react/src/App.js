import { WagmiConfig, useConnect, createClient,  configureChains, useAccount, useDisconnect, allChains } from "wagmi";
import * as React from "react";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import BitkeepConnector from "./connectors/BitkeepConnector";

import { Account } from "./components/Account";
import { NetworkSwitcher } from "./components/NetworkSwitcher";
import SignMessage from "./components/signMessage";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider } = configureChains(allChains, [alchemyProvider(), publicProvider()]);

const mainnetIds = [1, 10, 137, 42161] // Bitkeep only supports the  mainnet network for the time being
// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new BitkeepConnector({
      chains: chains.filter((v) =>mainnetIds.includes(v.id)),
      options: {
        name: "BitKeep",
        icon: "./assets/bitkeep-icon.png",
      },
    }),
  ],
  provider,
});

export function Profile() {
  const { isConnected, connector } = useAccount();

  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  return (
    <div>
      <div className="block">
        {isConnected && <button onClick={() => disconnect()}>Disconnect from {connector?.name}</button>}
        {connectors.map((connector) => (
          <button disabled={!connector.ready} key={connector.id} onClick={() => connect({ connector })}>
            <img src={connector.icon}></img>
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading && connector.id === pendingConnector?.id && " (connecting)"}
          </button>
        ))}
        {error && <div>{error.message}</div>}
      </div>

      <div className="block">
        <Account></Account>
      </div>
      <div className="block">
        <NetworkSwitcher></NetworkSwitcher>
      </div>

      {isConnected && (
        <div className="block">
          <SignMessage />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <Profile />
      </WagmiConfig>
    </div>
  );
}

export default App;
