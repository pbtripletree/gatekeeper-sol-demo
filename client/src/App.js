import logo from "./logo.svg";
import "./App.css";
import { SiwsMessage } from "siws";

import { useEffect, useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [content, setContent] = useState(["Loading..."]);

  const fetchContent = async () => {
    if (apiToken) {
      const contentResponse = await fetch("http://127.0.0.1:3333/content", {
        method: "GET",
        headers: new Headers({ Authorization: apiToken }),
      })
        .then(async (response) => {
          const data = await response.json();
          return data.status === 200 ? data.data : ["no content!"];
        })
        .catch((e) => setContent("error authenticating!"));
      setContent(contentResponse);
    }
  };

  const connectToApi = async () => {
    const { solana } = window;
    if (walletAddress && solana) {
      const message = new SiwsMessage({
        domain: window.location.host,
        address: walletAddress,
        statement: "Use SIWS to authenticate",
      });

      const signedMessage = await solana.request({
        method: "signMessage",
        params: {
          message: message.prepare(),
        },
      });

      const token = message.token(signedMessage.signature);

      setApiToken(token);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Sign in
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    connectToApi();
  }, [walletAddress]);

  useEffect(() => {
    fetchContent();
  }, [apiToken]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">siws / gatekeeper-sol demo 👀📈</p>
          <p className="sub-text">
            Server authentication via wallet signed token
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* Check for walletAddress and then pass in walletAddress */}
        {apiToken &&
          content.map((c, index) => {
            return (
              <div
                key={index}
                style={{
                  background: "-webkit-linear-gradient(left, #ff8867, #ff52ff)",
                  margin: "16px",
                  width: "75%",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "8px",
                }}
              >
                <div>{c}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
