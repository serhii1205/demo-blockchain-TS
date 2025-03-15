const uuid = require('uuid/v1');

export const generateNodeAddress = () => uuid().split('-').join(''); // generate a unique node address for each node

export const generateTransactionId = () => uuid().split('-').join(''); // generate a unique transaction id for each transaction