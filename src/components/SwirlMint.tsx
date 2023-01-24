import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useRef } from 'react';

const CROSSMINT_PROJECT_ID = process.env.REACT_APP_CROSSMINT_PROJECT_ID;
const CROSSMINT_CLIENT_SECRET = process.env.REACT_APP_CROSSMINT_CLIENT_SECRET;
const NFT_TICKET_IMG_URL = process.env.REACT_APP_NFT_TICKET_IMG_URL;

function SwirlMint() {
    const mintIdRef = useRef(null);
    const collectionIdRef = useRef(null);
    const collectionIdStatusRef = useRef(null);
    
    const { publicKey } = useWallet();

    async function mintNFT(collectionId: any) {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/' + collectionId + '/nfts';

        if(!publicKey) throw new WalletNotConnectedError();

        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-client-secret': CROSSMINT_CLIENT_SECRET,
                'x-project-id': CROSSMINT_PROJECT_ID
            },
            body: JSON.stringify({
                recipient: 'solana:' + publicKey,
                metadata: {
                name: 'Solana Swirl Prototype Ticket',
                image: NFT_TICKET_IMG_URL,
                description: 'A prototype of the Solana Swirl ticket!'
                }
            })
        };

        try {
            const response = await fetch(url, options)
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('error:' + error);
        }
    }

    async function checkMintStatus(collectionId: any, mintId: any) {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/' + collectionId + '/nfts/' + mintId;
        const options = {
            method: 'GET',
            headers: {
                'x-client-secret': CROSSMINT_CLIENT_SECRET,
                'x-project-id': CROSSMINT_PROJECT_ID
            }
        };

        try {
            const response = await fetch(url, options)
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('error:' + error);
        }
    }

    const handleMintNFTClick = () => {
        if(collectionIdRef.current) {
            mintNFT(collectionIdRef.current['value']);
        }
    };

    const handleMintStatusClick = () => {
        if(mintIdRef.current && collectionIdStatusRef.current) {
            checkMintStatus(mintIdRef.current['value'], collectionIdStatusRef.current['value']);
        }
    };

    return (
        <div>
            <div>
                <label>Collection Id</label>
                <input ref={collectionIdRef} type="text" id="collection-id-for-mint" name="Collection Id Reference"/>
                <button onClick={handleMintNFTClick}>Mint an NFT</button>
            </div>
            
            <div>
                <label>Mint Id</label>
                <input ref={collectionIdStatusRef} type="text" id="collect-id-for-status" name="Collection Id Reference"/>
                <label>Collection Id</label>
                <input ref={mintIdRef} type="text" id="mint-id" name="Mint Id"/>
                <button onClick={handleMintStatusClick}>Check mint status</button>
            </div>
        </div>
    );

}
export default SwirlMint;