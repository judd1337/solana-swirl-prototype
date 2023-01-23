import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useRef } from 'react';

const CROSSMINT_PROJECT_ID = process.env.REACT_APP_CROSSMINT_PROJECT_ID;
const CROSSMINT_CLIENT_SECRET = process.env.REACT_APP_CROSSMINT_CLIENT_SECRET;
const NFT_COLLECTION_IMG_URL = process.env.REACT_APP_NFT_COLLECTION_IMG_URL;

function SwirlCollection() {
    const createCollectionNameRef = useRef(null);
    const createCollectionDescriptionRef = useRef(null);
    const createCollectionIdRef = useRef(null);
    const getCollectionIdRef = useRef(null);

    async function createCollectionWithId(collectionName: any, collectionDescription: any, collectionId: any) {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/' + collectionId;
        const options = {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'x-client-secret': CROSSMINT_CLIENT_SECRET,
                'x-project-id': CROSSMINT_PROJECT_ID
            },
            body: JSON.stringify({
                chain: 'solana',
                metadata: {
                name: collectionName,
                imageUrl: NFT_COLLECTION_IMG_URL,
                description: collectionDescription
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

    async function getCollectionInformation(collectionId: any) {
        const fetch = require('node-fetch');
        const url = 'https://staging.crossmint.com/api/2022-06-09/collections/' + collectionId;
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

    const handleCreateCollectionClick = () => {
        // 👇 "inputRef.current.value" is input value
        if(createCollectionNameRef.current && createCollectionDescriptionRef.current && createCollectionIdRef.current) {
            createCollectionWithId(
                createCollectionNameRef.current['value'], 
                createCollectionDescriptionRef.current['value'], 
                createCollectionIdRef.current['value']
            );
        }
    };

    const handleGetCollectionClick = () => {
        // 👇 "inputRef.current.value" is input value
        if(getCollectionIdRef.current) {
            getCollectionInformation(getCollectionIdRef.current['value']);
        }
    };

    return (
        <div>
            <div>
                <div>
                    <label>Collection Name</label>
                    <input ref={createCollectionNameRef} type="text" id="message" name="message"/>

                    <label>Collection Description</label>
                    <input ref={createCollectionDescriptionRef} type="text" id="message" name="message"/>

                    <label>Collection Id</label>
                    <input ref={createCollectionIdRef} type="text" id="message" name="message"/>

                    <button onClick={handleCreateCollectionClick}>Create Collection</button>
                </div>
                <div>
                    <label>Collection Id</label>
                    <input ref={getCollectionIdRef} type="text" id="message" name="message"/>
                    <button onClick={handleGetCollectionClick}>Get Collection Information</button>
                </div>
                
            </div>
        </div>
    );
}
export default SwirlCollection;