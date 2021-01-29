import { WEB3_LOADED } from './action-type';
import getWeb3 from "../components/getWeb3";


export async function web3Loaded(connection) {
  const web3 = await getWeb3();
  return {
    type: WEB3_LOADED,
    payload: web3
  }
}