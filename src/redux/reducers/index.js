import { combineReducers } from 'redux';
import { web3Reducer } from './web3Reducer';
// import { loginReducer } from './loginReducer';

export default combineReducers({
  web3: web3Reducer,
});