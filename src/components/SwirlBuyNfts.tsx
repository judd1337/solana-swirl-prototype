import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';

import React, { FC, useCallback, useRef } from 'react';

const axios = require('axios')

const HELIUS_API_KEY = process.env.REACT_APP_HELIUS_API_KEY;

const SOLANA_MONKEY_BUSINESS_COLLECTION_ID = 'SMBH3wF6baUj6JWtzYvqcKuj2XCKWDqQxzspY12xPND'; // 200 SOL
const GHOST_KID_DAO_COLLECTION_ID = 'HwmaNqSh7JAfwufTVjNdh7KjDnDsbHzYVWB99PVEUjts'; // 13.5 SOL
const CRITTER_CULT_COLLECTION_ID = '6gWkABmdSeZsmcUXdRJDrgxAK95JeFHoo2XbcGCcdzm9'; // 6.5 SOL 
const BREAD_HEAD_COLLECTION_ID = 'bk5gRo28CvPnDYjWmLvB77h5hPMZp6UDx1Gbg5VTSUG' // 3 SOL
const BONK_YARD = '5p3633KthcAK4qL8NJKDRDPEPhGbgeBDviK6qyDUUHmS' // 1.25 SOL

const LAMPORTS_PER_SOL = 1000000000;

function SwirlBuyNfts() {
    const nftMintAccountAddress = useRef(null);
    const nftCollectionAccountAddress = useRef(null);
    const numberOfTicketsSold = useRef(null);
    const pricePerTicket = useRef(null);
    const collectionToBuy = useRef(null);

    const getActiveListings = async (nftCollectionAccountAddress: string) => {
        const url = "https://api.helius.xyz/v1/active-listings?api-key=" + HELIUS_API_KEY;
        const nftCollectionAddress = nftCollectionAccountAddress;
        
        let paginationToken;
        const nftListings: any[] = [];
        while (true) {
            const { data } = await axios.post(url, {
                "query": {                
                    "marketplaces": [
                        "MAGIC_EDEN" // [ MAGIC_EDEN, OPENSEA, FORM_FUNCTION, EXCHANGE_ART, SOLANART, SOLSEA, HOLAPLEX, CORAL_CUBE, YAWWW, SOLPORT, HYPERSPACE, DIGITAL_EYES, UNKNOWN ]
                    ],
                    "firstVerifiedCreators": [
                        nftCollectionAddress
                    ]
                },
                "options": {
                    "limit": 100,
                    "paginationToken": paginationToken
                }
            });
            console.log(`Got batch of ${data.result.length} listings!`);
            console.log("Active listings: ", data.result);
            
            nftListings.push(...data.result);
            if (data.paginationToken) {
                paginationToken = data.paginationToken;
                console.log(`Proceeding to next page with token ${paginationToken}.`);
            } else {
                console.log("Finished getting all events.");
                break;
            }
        }

        console.log(`Got ${nftListings.length} listings in total!`);
        return nftListings;
    };

    const describeNfts = async (nftMintAccountAddress: string) => {
        const url = 'https://api.helius.xyz/v1/nfts?api-key=' + HELIUS_API_KEY;
        const nftMintAddress = nftMintAccountAddress;
        const { data } = await axios.post(url, {
            mints: [
                nftMintAddress
            ]
        });
        console.log("nfts: ", data);
    };

    const calculateNFTBuyList = async (pricePerTicket: number, numberOfTicketsSold: number, collectionToBuy: string) => {
        let totalBudgetSol = pricePerTicket * numberOfTicketsSold;
        let totalBudgetLamport = totalBudgetSol * LAMPORTS_PER_SOL;

        const activeListings = await getActiveListings(collectionToBuy);
        const sortedActiveListings = sortByListingPrice(activeListings);
        const buyList = buildBuyList(sortedActiveListings, totalBudgetLamport);

        console.log("Buy List: ", buyList);
    }

    const buildBuyList = (sortedActiveListings, totalBudgetLamport) => {
        const buyList: any[] = [];
        let currentBudgetLeft = totalBudgetLamport;
        sortedActiveListings.forEach(function (currentNFT, index) {
            const costOfNFT = currentNFT.activeListings[0].amount;
            if(currentBudgetLeft - costOfNFT > 0) {
                currentBudgetLeft -= costOfNFT;
                buyList.push(currentNFT);
            }
        });
        return buyList;
    }

    const sortByListingPrice = (activeListings) => {
        let sortedActiveListings = activeListings.sort(
            (item1, item2) => (item1.activeListings[0].amount > item2.activeListings[0].amount) ? 1 : (item1.activeListings[0].amount < item2.activeListings[0].amount) ? -1 : 0);
        
        return sortedActiveListings;
    }

    const handleGetActiveListingsClick = () => {
        if(nftCollectionAccountAddress.current) {
            getActiveListings(nftCollectionAccountAddress.current['value']);
        }
    };

    const handleDescribeNFTClick = () => {
        if(nftMintAccountAddress.current) {
            describeNfts(nftMintAccountAddress.current['value']);
        }
    };

    const handleCalculateBuyListClick = () => {
        if(numberOfTicketsSold.current && pricePerTicket.current && collectionToBuy.current) {
            calculateNFTBuyList(
                pricePerTicket.current['value'], 
                numberOfTicketsSold.current['value'], 
                collectionToBuy.current['value']);
        }
    };
    

    return (   
        <div>
            
            <div>
                <label>Collection Account Address</label>
                <input ref={nftCollectionAccountAddress} type="text" id="message" name="message"/>
                <button onClick={handleGetActiveListingsClick}>Get Active NFT Listings</button>
            </div>
            
            <div>
                <label>Mint Account Address</label>
                <input ref={nftMintAccountAddress} type="text" id="message" name="message"/>
                <button onClick={handleDescribeNFTClick}>Describe NFT</button>
            </div>
            
            
            <div>
                <label>Number Of Tickets Sold</label>
                <input ref={numberOfTicketsSold} type="text" id="message" name="message"/>
                <label>Price Per Ticket (SOL)</label>
                <input ref={pricePerTicket} type="text" id="message" name="message"/>
                <label>Collection Id To Buy</label>
                <input ref={collectionToBuy} type="text" id="message" name="message"/>
                
                <button onClick={handleCalculateBuyListClick}>Calculate An NFT Buy List For Winners</button>
            </div>
        </div>
    );
}

export default SwirlBuyNfts;