import * as dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser' 
import { generateNodeAddress } from './utils';

import BlockChain from './blockchain/blockchain';

dotenv.config();
const app = express();
const port = process.env.API_PORT;

const tntCoin = new BlockChain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/blockchain', (req: any, res: any) => {
	res.json(tntCoin);
});

app.post('/transaction', (req: any, res: any) => {
	const {amount, sender, recipient} = req.body;
	const blockIndex = tntCoin.createNewTransaction(amount, sender, recipient);
	res.json({msg: `Transaction will be added in block ${blockIndex}`});
});

app.get('/mine', (req:any, res: any) => {
    const lastBlock = tntCoin.getLastBlock();
	const previousBlockHash = lastBlock.hash;
	const currentBlockData = {
		transactions: tntCoin.pendingTransactions,
		index: lastBlock.index + 1
	};

	const nonce = tntCoin.proofOfWork(previousBlockHash, currentBlockData);
	const blockHash = tntCoin.hashBlock(previousBlockHash, currentBlockData, nonce);

	tntCoin.createNewTransaction(12.5, '00', generateNodeAddress());

	const newBlock = tntCoin.createNewBlock(nonce, previousBlockHash, blockHash);

	res.json({msg: 'New block mined successfully', block: newBlock});
});

app.listen(port, () => {console.log(`Server is running on port ${port}`)});