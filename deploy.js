const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config({ path: './.env' });

// console.log('mneumonic: ', process.env.MNEUMONIC);

const provider = new HDWalletProvider(
    process.env.MNEUMONIC, //mneumonic for the rinkeby account
    process.env.INFURA_URL //infura endpoint
);

const web3 = new Web3(provider);

// async-await can only be used inside of functions
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('trying to deploy from account:', accounts[0]);

    const result =await new web3.eth.Contract(JSON.parse(interface)) // contract interfact = ABI
        .deploy({ data: '0x' + bytecode })
        .send({ gas: '1000000', from: accounts[0] });
        console.log('interface: ', interface);
        
        console.log('contract deployed to: ', result.options.address);        
};

deploy();