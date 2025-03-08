const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();

bitcoin.createNewBlock(2389, '', '90AND90N9N');

bitcoin.createNewTransaction(10, 'USER10002121', 'USER200002321');
bitcoin.createNewTransaction(15, 'USER10002121', 'USER200002321');
bitcoin.createNewTransaction(20, 'USER10002121', 'USER200002321');

bitcoin.createNewBlock(2551, '90AND90N32N', '90AND90N9T23');

console.log('bitcoin >>>',bitcoin);

console.log('last block >>>', bitcoin.getLastBlock());
