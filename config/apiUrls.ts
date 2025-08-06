export const API_URLS = {
  base: 'https://parabank.parasoft.com/parabank/services_proxy/bank',
  transactions: {
    findByAmount: (amount: number) => `amount/${amount}`,
    byAmount: (accountId: string, amount: number) => 
        `/accounts/${accountId}/transactions/amount/${amount}`,
  },
};