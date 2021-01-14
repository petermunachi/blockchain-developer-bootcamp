const Token = artifacts.require("./Token");

import { tokens, EVM_REVERT } from "../helpers"

require('chai')
  .use(require('chai-as-promised'))
  .should()


contract('Token', ([deployer, reciever, exchange])=>{

  const name = 'Comfort Token';
  const symbol = 'Comfort';
  const decimals = '18';
  const totalSupply = tokens(1000000).toString();
  let token;

  beforeEach(async () => {
    token = await Token.new();
  })

  describe('deployment', ()=>{

    it('tracks the name', async () => {
      const result = await token.name();
      result.should.equal(name);
    })

    it('tracks the symbol', async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    })

    it('tracks the decimals', async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    })

    it('tracks the total supply', async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply.toString());
    })

    it('assigns the total supply to the deployer', async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply.toString())
    })


  })

  describe('sending tokens', () => {
    let result;
    let amount; 


    describe('success', async () => {

      beforeEach(async () => {;
        amount = tokens(100);
        // Transfer
        result = await token.transfer(reciever, amount, { from: deployer });
      })
  
      it('transfers token balances', async ()=> {
        var balanceOf;
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(reciever )
        balanceOf.toString().should.equal(tokens(100).toString())
      })
  
      it('emit transfer event', async ()=> {
        const log = result.logs[0];
        log.event.should.eq('Transfer');
  
        const event = log.args;
        event._from.toString().should.eq(deployer, "_from  is correct");
        event._to.toString().should.eq(reciever, "_to  is correct");
        event._value.toString().should.eq(amount.toString(), "_value  is correct");
        
      })
      
    })

    describe('failure', async () => {
      
      it('rejects insufficient balance', async ()=>{
        let invalidAmount;
        invalidAmount = tokens(100000000) // 100 million - greater than total supply
        await token.transfer(reciever, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

        // Attempt transfer tokens, when you have none
        invalidAmount = tokens(10); // recipent has no tokens
        await token.transfer(deployer, invalidAmount, { from: reciever }).should.be.rejectedWith(EVM_REVERT);
      })

      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, amount, { from: deployer}).should.be.rejected;
      })

      // it('transfer amount less than 0', async () => {
      //   await token.transfer(reciever, tokens(-121), { from: deployer}).should.be.rejected;
      // })

    })
    

  })


  describe('approving tokens', () => {
    let result;
    let amount;

    beforeEach(async ()=>{
      amount = tokens(100);
      result = await token.approve(exchange, amount, { from: deployer });
    })

    describe('success', () => {
      
      it('allocates an allowance for delegated token spending', async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal(amount.toString());
      })

      it('emit Approval event', async ()=> {
        const log = result.logs[0];
        log.event.should.eq('Approval');
  
        const event = log.args;
        event._owner.toString().should.eq(deployer, "_owner  is correct");
        event._spender.toString().should.eq(exchange, "_spender is correct");
        event._value.toString().should.eq(amount.toString(), "_value  is correct");
        
      })
      
    })
    
    describe('failure', () => {

      it('rejects invalid spender', async () => {
        await token.approve(0x0, amount, { from: deployer}).should.be.rejected;
      })

      // it('approve amount less than 0', async () => {
      //   await token.approve(exchange, tokens(-222), { from: deployer}).should.be.rejected;
      // })
      
    })
    
  })

  describe('delegated token transfer', () => {
    let result;
    let amount; 

    beforeEach(async () => {;
      amount = tokens(100);
      await token.approve(exchange, amount, { from: deployer });
    })

    describe('success', async () => {

      beforeEach(async () => {;
        amount = tokens(100);
        // Transfer
        result = await token.transferFrom(deployer, reciever, amount, { from: exchange });
      })
  
      it('transferFrom token balances', async ()=> {
        var balanceOf;
        balanceOf = await token.balanceOf(deployer)
        balanceOf.toString().should.equal(tokens(999900).toString())
        balanceOf = await token.balanceOf(reciever)
        balanceOf.toString().should.equal(tokens(100).toString())
      })

      it('reset the allowance', async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal('0');
      })
  
      it('check receiver balance', async () => {
      
        const balanceOf = await token.balanceOf(reciever)
        balanceOf.toString().should.equal(tokens(100).toString())
      })
  
      it('emit transfer event', async ()=> {
        const log = result.logs[0];
        log.event.should.eq('Transfer');
  
        const event = log.args;
        event._from.toString().should.eq(deployer, "_from is correct");
        event._to.toString().should.eq(reciever, "_to is correct");
        event._value.toString().should.eq(amount.toString(), "_value is correct");
        
      })
      
    })

    describe('failure', async () => {
      
      it('rejects insufficient balance', async ()=>{
        const invalidAmount = tokens(100000000) // 100 million - greater than total supply
        await token.transferFrom(deployer, reciever, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT);

      })

      it('rejects invalid recipients', async () => {
        await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected;
      })

      it('transfer amount less than 0', async () => {
        await token.transferFrom(deployer, reciever, tokens(-121), { from: exchange}).should.be.rejected;
      })

    })
    

  })
  
  

})