const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const provider = new HDWalletProvider(
    'joke planet party damage powder comfort step country clean join easily popular', //mneumonic for the rinkeby account
    'https://rinkeby.infura.io/v3/2b0ca63792bc4ec5a398c157293ef54f' //infura endpoint
);

const web3 = new Web3(provider);

// async-await can only be used inside of functions
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('trying to deploy from account:', accounts[0]);

    const result =await new web3.eth.Contract(JSON.parse(interface)) // contract interfact = ABI
        .deploy({ data: '0x' + bytecode, arguments: ['og contract deployment test'] })
        .send({ gas: '1000000', from: accounts[0] });

        console.log('contract deployed to: ', result.options.address);        
};

deploy();