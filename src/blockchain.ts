const sha256 = require('sha256');
import { IBlockChain, IBlock, ITransaction } from "./types";

class BlockChain implements IBlockChain {
    chain: IBlock[] = []; 
    pendingTransactions: ITransaction[] = [];
    createNewBlock = (nonce: number, previousBlockHash: string, hash: string): IBlock => {
        const newBlock: IBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce,
            hash,
            previousBlockHash
        };
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }
    getLastBlock = () => this.chain[this.chain.length - 1];
    createNewTransaction = (amount: number, sender: string, recipient: string) => {
        this.pendingTransactions.push({
            amount,
            sender,
            recipient
        });

        return this.getLastBlock()['index'] + 1;
    }
    hashBlock = (previousBlockHash: string, currentBlockData: ITransaction[], nonce: number) => {
        const stringifiedData = previousBlockHash + JSON.stringify(currentBlockData) + nonce;
        return sha256(stringifiedData);
    }; 


    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
    }
}

module.exports = BlockChain;