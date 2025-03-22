export interface IBlock {
    index: number;
    timestamp: number;
    transactions: any[];
    nonce: number;
    hash: string;
    previousBlockHash: string;
}

export interface ITransaction {
    amount: number;
    sender: string;
    recipient: string;
    transactionId: string;
}

export interface ICurrentBlockData {
    transactions: ITransaction[];
    index: number;
}

export interface IBlockChain {
    chain: IBlock[];
    pendingTransactions: ITransaction[];
    currentNodeUrl: string;
    networkNodes: string[];
    createNewBlock: (nonce: number, previousBlockHash: string, hash: string) => IBlock;
    getLastBlock: () => IBlock;
    createNewTransaction: (amount: number, sender: string, recipient: string) => void;
    hashBlock: (previousBlockHash: string, currentBlockData: ICurrentBlockData, nonce: number) => string;
    proofOfWork: (previousBlockHash: string, currentBlockData: ICurrentBlockData) => number;
    addTransactionToPendingTransactions: (transaction: ITransaction) => number;
}

