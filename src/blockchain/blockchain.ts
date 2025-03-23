import sha256 from 'sha256';
const currentNodeUrl = process.argv[3];
import { IBlockChain, IBlock, ITransaction, ICurrentBlockData } from "../types";
import { generateTransactionId } from '../utils';
import {VALID_HASH_PREFIX, GENESIS_BLOCK_HASH, GENESIS_BLOCK_NONCE, GENESIS_BLOCK_PREV_HASH} from '../constants';

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
        let isValidChain = true;
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];
            const {transactions, index, nonce, previousBlockHash} = currentBlock;
            const {hash: hashFromPrevBlock} = previousBlock;
            const blockHash = this.hashBlock(hashFromPrevBlock, {transactions, index}, nonce);
            if (blockHash.substring(0, 4) !== VALID_HASH_PREFIX) isValidChain = false;
            if (previousBlockHash !== hashFromPrevBlock) isValidChain = false;
        }


        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock.nonce === GENESIS_BLOCK_NONCE;
        const correctPreviousBlockHash = genesisBlock.previousBlockHash === GENESIS_BLOCK_PREV_HASH;
        const correctHash = genesisBlock.hash === GENESIS_BLOCK_HASH;
        const pendingTransactions = genesisBlock.transactions.length === 0;

        if (!correctNonce || !correctPreviousBlockHash || !correctHash || !pendingTransactions) {
            isValidChain = false;
        }  

        return isValidChain;
    }

    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.createNewBlock(GENESIS_BLOCK_NONCE, GENESIS_BLOCK_PREV_HASH, GENESIS_BLOCK_HASH); // Genesis `block creation
    }
}

export default BlockChain;