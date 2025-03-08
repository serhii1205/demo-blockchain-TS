import { IBlockChain, IBlock } from "./types";

class BlockChain implements IBlockChain {
    chain: IBlock[] = []; 
    newTransactions = [];
    createNewBlock = (nonce: number, previousBlockHash: string, hash: string): IBlock => {
        const newBlock: IBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.newTransactions,
            nonce,
            hash,
            previousBlockHash
        };
        this.newTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }
    getLastBlock = () => this.chain[this.chain.length - 1]; 


    constructor() {
        this.chain = [];
        this.newTransactions = [];
    }
}

module.exports = BlockChain;