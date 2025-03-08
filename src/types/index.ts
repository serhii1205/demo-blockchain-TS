export interface IBlock {
    index: number;
    timestamp: number;
    transactions: any[];
    nonce: number;
    hash: string;
    previousBlockHash: string;
}

export interface IBlockChain {
    chain: IBlock[];
    newTransactions: any[];
    createNewBlock: (nonce: number, previousBlockHash: string, hash: string) => IBlock;
    getLastBlock: () => IBlock;
}

