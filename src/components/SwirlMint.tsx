import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useRef } from 'react';

const CROSSMINT_PROJECT_ID = process.env.REACT_APP_CROSSMINT_PROJECT_ID;
const CROSSMINT_CLIENT_SECRET = process.env.REACT_APP_CROSSMINT_CLIENT_SECRET;
const NFT_TICKET_IMG_URL = process.env.REACT_APP_NFT_TICKET_IMG_URL;

function SwirlMint() {
    const mintIdRef = useRef(null);

    async function mintNft() {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-client-secret': CROSSMINT_CLIENT_SECRET,
                'x-project-id': CROSSMINT_PROJECT_ID
            },
            body: JSON.stringify({
                recipient: 'email:david.lindstroem@gmail.com:solana',
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

    async function checkMintStatus(mintId: any) {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/' + mintId;
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

    const handleMintClick = () => {
        // 👇 "inputRef.current.value" is input value
        if(mintIdRef.current) {
            checkMintStatus(mintIdRef.current['value']);
        }
    };

    return (
        <div>
            <div>
                <button onClick={mintNft}>Mint an NFT</button>
                <div>
                    <label>Mint Id</label>
                    <input ref={mintIdRef} type="text" id="message" name="message"/>
                    <button onClick={handleMintClick}>Check mint status</button>
                </div>
            </div>
        </div>
    );

}
export default SwirlMint;