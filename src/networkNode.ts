import * as dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser' 
import { generateNodeAddress } from './utils';

import BlockChain from './blockchain/blockchain';

dotenv.config();
const app = express();
// const port = process.env.API_PORT;
const port = process.argv[2] || 3000;

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

// register a node and broadcast it the network
// this endpoint wil send in url of a new node that we want to add to the network
app.post('/register-and-broadcast-node', (req: any, res: any) => {
	const {nodeUrl} = req.body;
	
	if (tntCoin.networkNodes.includes(nodeUrl)) {
		return;
	}
	tntCoin.networkNodes.push(nodeUrl);

	const registerNodePromises = tntCoin.networkNodes.map(networkNodeUrl => {
		return fetch(`${networkNodeUrl}/register-node`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nodeUrl })
		});
	});

	 Promise.all(registerNodePromises).then(() => {
		return fetch(`${nodeUrl}/register-nodes-bulk`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ networkNodes: [...tntCoin.networkNodes, tntCoin.currentNodeUrl] })
		});
	 }).then(data => {
		res.json({ msg: `New node ${data} registered with network successfully`});
	 });
});

// register a node with the network
app.post('/register-node', (req: any, res: any) => {

});

// register multiple odes at once
app.post('/register-nodes-bulk', (req: any, res: any) => {});
	

app.listen(port, () => {console.log(`Server is running on port ${port}`)});