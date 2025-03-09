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
}

export interface ICurrentBlockData {
    transactions: ITransaction[];
    index: number;
}

export interface IBlockChain {
    chain: IBlock[];
    pendingTransactions: any[];
    createNewBlock: (nonce: number, previousBlockHash: string, hash: string) => IBlock;
    getLastBlock: () => IBlock;
    createNewTransaction: (amount: number, sender: string, recipient: string) => void;
    hashBlock: (previousBlockHash: string, currentBlockData: ICurrentBlockData, nonce: number) => string;
    proofOfWork: (previousBlockHash: string, currentBlockData: ICurrentBlockData) => number;
}

