// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
import './Token.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


// Deposit & Withdraw Funds
// Manage Orders - Make or Cancel
// Handle Trades - Charge fees

// TODO:
// [X] Set the fee account
// [X] Deposit Ether
// [ ] Withdraw Ether
// [X] Deposit Tokens
// [ ] Withdraw Tokens
// [ ] Check balances
// [ ] Make order
// [ ] Cancel order
// [ ] Fill order
// [ ] Charge Fees



contract Exchange {

  // Instatiating libraries
  using SafeMath for uint;

  // Variables
  address public feeAccount; // the account that receives exchange fee account
  uint256 public feePercent; // the fee percentage
  address constant ETHER = address(0); // store Ether in tokens mapping with blank address

  mapping (address=>mapping (address=> uint256)) public tokens;


  // Events
  event Deposit(address _token, address _user, uint256 _amount, uint256 _balance);


  constructor (address _feeAccount, uint256 _feePercent) public {
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  // Fallback: reverts if Ether is sent to this smart contract by mistake
  fallback () external {
    revert();
  }

  function depositEther() payable public {
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);

  }

  function depositToken(address _token, uint256 _amount) public {
    require(_token != ETHER);
    require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
  }


}


