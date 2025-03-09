const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const BlockChain = require('./blockchain');

const app = express();
const port = process.env.API_PORT;


const blockchain = new BlockChain();

app.get('/blockchain', (req: any, res: any) => {
	// res.json(blockchain);
});

app.post('/transaction', (req: any, res: any) => {
    
});

app.get('/mine', (req:any, res: any) => {
    
});

app.listen(port, () => {console.log(`Server is running on port ${port}`)});