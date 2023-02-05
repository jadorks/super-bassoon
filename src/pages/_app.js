import "@/styles/globals.css";
import Layout from "@/components/Layout";

import {
  Mainnet,
  DAppProvider,
  MetamaskConnector,
  CoinbaseWalletConnector,
  Localhost,
} from "@usedapp/core";
import { WalletConnectConnector } from "@usedapp/wallet-connect-connector";
import { DLCDappProvider } from "@/providers/DLCProvider/DLCDappProvider";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  },
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),
    walletConnect: new WalletConnectConnector({
      chainId: Mainnet.chainId,
      rpc: {
        [Mainnet.chainId]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
      },
    }),
  },
  multicallVersion: 2,
  multicallAddresses: {
    [Mainnet.chainId]: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  },
  gasLimitBufferPercentage: 20,
  autoConnect: true,
  networks: [Mainnet],
  noMetamaskDeactivate: true,
};

export default function App({ Component, pageProps }) {
  return (
    <DAppProvider config={config}>
      <DLCDappProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DLCDappProvider>
    </DAppProvider>
  );
}
