export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DECIMALS = (10**18);

// export const ether = (wei) => {
//     if (wei) {
//         return(wei / DECIMALS)
//     }
// }

export const ether = (n) => {
    return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));
}

// Same as Ether
export const tokens = (n) => ether(n);  