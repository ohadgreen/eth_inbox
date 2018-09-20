require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const INITIAL_STRING = 'Hello first contract';

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    // 1. get a list of all test unlocked accounts
    // with promise syntax
    /* web3.eth.getAccounts()
        .then(fetchedAccounts => {
            console.log(fetchedAccounts);            
        }); */

    // with async-await syntax
    accounts = await web3.eth.getAccounts();

    // 2. use one account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [INITIAL_STRING]
        })
        .send({ from: accounts[0], gas: '1000000' });
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('debloys a contract', () => {
        console.log(inbox);        
        assert.ok(inbox.options.address); // check that an address exists (not null or undefined)
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message().call(); // message is the contract field that has a default getter
        assert.equal(message, INITIAL_STRING);
    });
    it('can set a message', async () => {
        await inbox.methods.setMessage('new test message').send({ from: accounts[0], gas: '1000000' });
        // call() is for read only methods, send() is for methods that changes the contract state
        const newMsg = await inbox.methods.message().call();;
        assert.equal(newMsg, 'new test message'); 
    })

})



