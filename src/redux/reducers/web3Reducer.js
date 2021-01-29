import { WEB3_LOADED } from '../actions/action-type';

export const web3Reducer = (state = {}, action) => {
  switch (action.type) {
    case WEB3_LOADED:
      return {
        ...state,
        web3: action.payload
      };
   
    default:
      return state;
  }
};