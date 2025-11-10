const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const contractAddress = process.env.CONTRACT_ADDRESS;

// Assume a simple voting contract ABI with a Vote event
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "choice", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "ageGroup", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "Vote",
    "type": "event"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function fetchVotes(fromBlock = 0, toBlock = 'latest') {
  const events = await contract.getPastEvents('Vote', {
    fromBlock,
    toBlock
  });

  return events.map(event => ({
    voter_address: event.returnValues.voter,
    choice: event.returnValues.choice,
    age_group: event.returnValues.ageGroup,
    timestamp: new Date(event.returnValues.timestamp * 1000),
    block_number: event.blockNumber,
    transaction_hash: event.transactionHash
  }));
}

module.exports = { fetchVotes };
