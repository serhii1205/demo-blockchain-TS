const uuid = require('uuid/v1');

export const generateNodeAddress = () => uuid().split('-').join(''); // generate a unique node address for each node
