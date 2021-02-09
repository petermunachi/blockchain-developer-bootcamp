// WEB3
export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    connection
  }
}

export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    account
  }
}

// TOKEN
export function tokenLoaded(contract) {
  return {
    type: 'TOKEN_LOADED',
    contract
  }
}

// EXCHANGE
export function exchangeLoaded(contract) {
  return {
    type: 'EXCHANGE_LOADED',
    contract
  }
}


export function cancelledOrdersLoaded(cancelledOrders) {
  return {
    type: 'CANCELLED_ORDER_LOADED',
    cancelledOrders
  }
}

export function filledOrdersLoaded(filledOrders) {
  return {
    type: 'FILLED_ORDER_LOADED',
    filledOrders
  }
}
export function allOrdersLoaded(allOrders) {
  return {
    type: 'ALL_ORDER_LOADED',
    allOrders
  }
}

