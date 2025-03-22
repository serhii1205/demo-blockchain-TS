import sha256 from 'sha256';
const currentNodeUrl = process.argv[3];
import { IBlockChain, IBlock, ITransaction, ICurrentBlockData } from "../types";
import { generateTransactionId } from '../utils';
import {VALID_HASH_PREFIX} from '../constants';

class BlockChain implements IBlockChain {
    chain: IBlock[] = []; 
    pendingTransactions: ITransaction[] = [];
    currentNodeUrl = '';
    networkNodes: string[] = [];
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

        const newTransaction: ITransaction = {
            amount,
            sender,
            recipient,
            transactionId: generateTransactionId()
        };

        return newTransaction;
    }
    addTransactionToPendingTransactions = (transaction: ITransaction) => {
        this.pendingTransactions.push(transaction);
        return this.getLastBlock()['index'] + 1;
    }
    hashBlock = (previousBlockHash: string, currentBlockData: ICurrentBlockData, nonce: number) => {
        const stringifiedData = previousBlockHash + JSON.stringify(currentBlockData) + nonce;
        return sha256(stringifiedData);
    };
    proofOfWork = (previousBlockHash: string, currentBlockData: ICurrentBlockData) => {
        
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== VALID_HASH_PREFIX) {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    };

    chainIsValid = (blockchain: IBlock[]) =>  {
        let validChain = true;
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(previousBlock.hash, {transactions: currentBlock.transactions, index: currentBlock.index}, currentBlock.nonce);
            if (blockHash.substring(0, 4) !== VALID_HASH_PREFIX) validChain = false;
            if (currentBlock.previousBlockHash !== previousBlock.hash) validChain = false;
        }

        return validChain;
    }

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.createNewBlock(100, '0', '0'); // Genesis `block creation
    }
}

export default BlockChain;