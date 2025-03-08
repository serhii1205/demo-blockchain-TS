const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();

//Testing hashing blocks

const previousBlockHash = '765NTY5390N9N';
const currentBlockData = [
    {amunt: 10, sender: '765NTY5390N29847', recipient: '765NTY5390N29838'},
    {amunt: 50, sender: '765NTY5390N1234', recipient: '765NTY5390KKKIU291'},
    {amunt: 50, sender: '888KJHDIUYD9832', recipient: '765NTY5MMM90KKKIU291'},
];

const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)

console.log('Check hash >>>', bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));