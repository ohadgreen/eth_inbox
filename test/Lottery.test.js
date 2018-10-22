const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // 2. use one account to deploy the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery contract', () => {
    it('deploys a contract', () => {
        // console.log(lottery);
        assert.ok(lottery.options.address); // check that an address exists (not null or undefined)
    });

    // method.send => interacting with method that changes the contract
    // method.call => interacting with method that doesn't change the contract (read only)
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });
    it('allows multi accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[5],
            value: web3.utils.toWei('0.05', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[5], players[1]);
        assert.equal(2, players.length);
    });
    it('require minimum amount of ether to enter', async () => {

        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.00001', 'ether')
            });
        assert(false); // make sure it doesn't executed
        }
        catch (error) {
            // console.log('error: ', error);
            assert(error);
        }
    });
    it('only manager can call pickWinner', async() => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1] // NOT the manager                
            });
            assert(false);            
        }
        catch(err){
            assert(err);
        }
    });

    it('sends money to winner and resets players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({ from: accounts[0] });        
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const diff = finalBalance - initialBalance;
        console.log('initialBalance: ' + initialBalance + ' finalBalance: ' + finalBalance);
        
        assert(diff > web3.utils.toWei('1.99', 'ether')); // diff not included the gas fee
    });
});