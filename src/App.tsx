import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter, 
          LedgerWalletAdapter, SolletWalletAdapter, SolletExtensionWalletAdapter } from '@solana/wallet-adapter-wallets';

import { clusterApiUrl } from '@solana/web3.js';

import React, { FC, ReactNode, useMemo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import './App.css';
import logo from './solana-3d.webp';

import SwirlMint from './components/SwirlMint';
import SwirlCollection from './components/SwirlCollection';
import SwirlBuyNfts from './components/SwirlBuyNfts';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <div className="App">
            <Context>
                <Content />
                <h1>Solana Swirl Control Panel</h1>
            
                <Tabs className="Tabs">
                    <TabList>
                        <Tab>Mint NFT</Tab>
                        <Tab>Handle Collections</Tab>
                        <Tab>Handle Winners</Tab>
                    </TabList>
                    
                    <TabPanel>
                        <SwirlMint />
                    </TabPanel>
                    <TabPanel>
                        <SwirlCollection />
                    </TabPanel>
                    <TabPanel>
                        <SwirlBuyNfts />
                    </TabPanel>
                </Tabs>
                
                <div className="logo">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            </Context>
        </div>
    );
}
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network}),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter({ network}),
            new SolletExtensionWalletAdapter({ network}),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>                   
                    {children /* Your app's components go here, nested within the context providers. */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
  return (
      <div className="App wallet">
          <WalletMultiButton />
      </div>
  );
};
