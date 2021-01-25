import { ether, tokens, EVM_REVERT, ETHER_ADDRESS } from "../helpers";

const Token = artifacts.require("./Token");
const Exchange = artifacts.require("./Exchange");


require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Exchange', ([deployer, feeAccount, user1]) => {
    let token;
    let exchange;
    const feePercent = 10;

    beforeEach(async() => {
        // Deploy tokens
        token = await Token.new();
        // Transfer tokens to some exchange
        token.transfer(user1, tokens(100), { from: deployer });
        // Deploy exchange
        exchange = await Exchange.new(feeAccount, feePercent);
    })

    describe('deployment', () => {

        it('tracks the fee account', async() => {
            const result = await exchange.feeAccount();
            result.should.equal(feeAccount);
        })

        it('tracks the fee percent', async() => {
            const result = await exchange.feePercent();
            result.toString().should.equal(feePercent.toString());
        })

    })

    describe('fallback', () => {
      it('reverts when Ether is sent', async () => {
        await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT);
      })
      
    })
    

    describe('depositing Ether', async () => {
      let result;
      let amount;

      beforeEach(async ()=> {
        amount = ether(1);
        result = await exchange.depositEther({from: user1, value: amount})
      })

      it('tracks the Ether deposit', async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal(amount.toString());
      })

      it('emit deposit event', async () => {
        const log = result.logs[0];
        log.event.should.eq('Deposit');

        const event = log.args;
        event._token.toString().should.eq(ETHER_ADDRESS, "_token address is correct");
        event._user.toString().should.eq(user1, "_user address is correct");
        event._amount.toString().should.eq(amount.toString(), "_amount is correct");
        event._balance.toString().should.eq(amount.toString(), "_balance is correct");

      })
      
    })
    

    describe('depositing tokens', () => {

        let result;
        let amount;

        describe('success', () => {
            beforeEach('depositing tokens', async() => {
                amount = tokens(10);
                await token.approve(exchange.address, amount, { from: user1 })
                result = await exchange.depositToken(token.address, amount, { from: user1 })
            })
            it('tracks the token deposit', async() => {
                let balance;
                // Check exchange token balance
                balance = await token.balanceOf(exchange.address);
                balance.toString().should.equal(amount.toString());

                // Check tokens on exchange
                balance = await exchange.tokens(token.address, user1);
                balance.toString().should.equal(amount.toString());


            })

            it('emit deposit event', async() => {
                const log = result.logs[0];
                log.event.should.eq('Deposit');

                const event = log.args;
                event._token.toString().should.eq(token.address, "_token address is correct");
                event._user.toString().should.eq(user1, "_user address is correct");
                event._amount.toString().should.eq(amount.toString(), "_amount is correct");
                event._balance.toString().should.eq(amount.toString(), "_balance is correct");

            })

        })

        describe('failure', () => {
            it('rejects Ether deposits', async() => {
                await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT);

            })
            it('fails when no tokens are approved', async() => {
                // Don't approve any tokens before depositing
                await exchange.depositToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT);

            })
        })

    })





})