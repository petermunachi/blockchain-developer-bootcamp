import getWeb3 from "../components/getWeb3";
import { web3Loaded } from './actions/web3Action';

export const loadWeb3 = async (dispatch) => {
  const web3 = await getWeb3();
  dispatch(web3);
  return web3;
}