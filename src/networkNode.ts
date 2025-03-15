import * as dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser' 
import { generateNodeAddress } from './utils';

import BlockChain from './blockchain/blockchain';
// TODO:  impoove logging and error handling;
// TODO:  impove structure of the project;
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

app.post('/transaction/broadcast', (req: any, res: any) => {
	const {amount, sender, recipient} = req.body;
	const newTransaction = tntCoin.createNewTransaction(amount, sender, recipient);
	tntCoin.addTransactionToPendingTransactions(newTransaction);

	const registeredNewTransactionsPromises = tntCoin.networkNodes.map(networkNodeUrl => {
		return fetch(`${networkNodeUrl}/transaction`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newTransaction)
		});
	});

	Promise.all(registeredNewTransactionsPromises).then(() => {
		res.json({msg: 'Transaction created and broadcasted successfully'});
	})
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
			body: JSON.stringify({ allNetworkNodes: [...tntCoin.networkNodes, tntCoin.currentNodeUrl] })
		});
	 }).then(data => {
		res.json({ msg: 'New node registered with network successfully'});
	 });
});

// register a node with the network
app.post('/register-node', (req: any, res: any) => {
	const {nodeUrl} = req.body;
	const isNotPresentNode = !tntCoin.networkNodes.includes(nodeUrl);
	const notCurrentNode = tntCoin.currentNodeUrl !== nodeUrl;
	if (isNotPresentNode && notCurrentNode) {
		tntCoin.networkNodes.push(nodeUrl);
	}
	
	res.json({ msg: 'New node registered successfully'});
});

// register multiple odes at once
// this endpoint will bw hit on the new node that we want to add to the network
app.post('/register-nodes-bulk', (req: any, res: any) => {
	const {allNetworkNodes} = req.body;

	allNetworkNodes.forEach((networkNodeUrl: string) => {
		const isNotPresentNode = !tntCoin.networkNodes.includes(networkNodeUrl);
		const notCurrentNode = tntCoin.currentNodeUrl !== networkNodeUrl;
		if (isNotPresentNode && notCurrentNode) {
			tntCoin.networkNodes.push(networkNodeUrl);
		}
	});
	res.json({ msg: 'Bulk registration successful'});
});
	

app.listen(port, () => {console.log(`Server is running on port ${port}`)});