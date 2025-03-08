const BlockChain = require('./blockchain');

const bitcoin = new BlockChain();

bitcoin.createNewBlock(2389, '', '90AND90N9N');
bitcoin.createNewBlock(1110, '90AND90N9N', '90AND90N32N');
bitcoin.createNewBlock(2551, '90AND90N32N', '90AND90N9T23');

console.log('bitcoin >>>',bitcoin);

console.log('last block >>>', bitcoin.getLastBlock());
