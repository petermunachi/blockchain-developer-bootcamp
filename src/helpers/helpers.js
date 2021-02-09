export const EVM_REVERT = 'VM Exception while processing transaction: revert';
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
export const GREEN = 'success';
export const RED = 'danger';

export const DECIMALS = (10**18);

export const ether = (wei) => {
    if (wei) {
        return(wei / DECIMALS)
    }
}

// Same as Ether
export const tokens = (n) => ether(n);  