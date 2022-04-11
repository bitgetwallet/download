import * as React from "react";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import "./App.css";

class App extends React.Component {
  connector = null;
  state = {
    connector: null,
    connected: false,
    chainId: 1,
    selectedAddress: "",
  };
  connect = async () => {
    // bridge url

    const bridge = "https://bridge.walletconnect.org";

    // create new connector
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    // check if already connected
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    } else {
      const { chainId, accounts } = connector;
      this.setState({
        selectedAddress: accounts[0],
        chainId: chainId,
      });
    }
    this.connector = connector;
    // subscribe to events
    await this.initEvent();
  };
  initEvent() {
    this.connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);
      alert("connected");
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.setState({
        selectedAddress: accounts[0],
        chainId: chainId,
      });
    });
    this.connector.on("session_update", (error, payload) => {
      console.log(`connector.on("session_update")`);
      alert("session_update");
      if (error) {
        throw error;
      }

      const { accounts, chainId } = payload.params[0];
      this.setState({
        selectedAddress: accounts[0],
        chainId: chainId,
      });
    });

    this.connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);
      alert("disconnect");
      if (error) {
        throw error;
      }
      this.setState({
        selectedAddress: "",
        chainId: 1,
      });
    });
  }
  disconnected() {
    if (this.connector) {
      this.connector.killSession();
      this.setState({
        selectedAddress: "",
        chainId: 1,
      });
    }
  }
  async sendTransaction() {
    // Draft transaction
    const tx = {
      from: this.state.selectedAddress, // Required
      to: document.querySelector("#to").value, // Required (for non contract deployments)
      data: "0x", // Required
      gasPrice: "0x02540be400", // Optional
      gas: "0x9c40", // Optional
      value: String(document.querySelector("#amount").value * 10 ** Number(18)), // Optional
      // nonce: "0x0114", // Optional
    };

    // Send transaction
    return this.connector.sendTransaction(tx);
  }
  render() {
    const { selectedAddress, chainId } = this.state;
    return (
      <>
        <div className="testdemo">
          <div>
            <h1>链接</h1>

            {<button disabled={selectedAddress} data-method="connect" onClick={this.connect.bind(this)}>connect</button>}
            {<button  data-method="disconnected"  onClick={this.disconnected.bind(this)}>disconnected</button>}
            <div>
              selectedAddress: <span id="account">{selectedAddress}</span>
            </div>
            <div>
              chainId : <span id="chainId">{chainId}</span>
            </div>
          </div>

          <div>
            <h1>转账EVM</h1>
            from:
            <input id="from" type="text"  value={selectedAddress} disabled/>
            to:
            <input id="to" type="text"  value="0x1da770d53eBe21c79cebD9cb0C9ce885BeD251DC"/>
            amount:
            <input id="amount" type="number" />
            <button data-method="sendTransaction" onClick={this.sendTransaction.bind(this)}>sendTranstion</button>
          </div>
        </div>
      </>
    );
  }
}

export default App;
