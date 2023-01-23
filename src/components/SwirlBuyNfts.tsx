import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useRef } from 'react';


function SwirlBuyNfts() {

    return (   
        <div>
            {/* TODO: Implement these buttons */}
            <button>Check Tickets Bought</button>
            <button>Swirl Buy NFTs</button>
            <button>Swirl Transfer NFTs</button>
        </div>
    );
}

export default SwirlBuyNfts;