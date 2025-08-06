import { test } from '@playwright/test';
import { createUserDetails } from '../utils/user-utils';
import { RegistrationPage } from '../pages/registration-page';
import { AccountsPage } from '../pages/account-page';
import { TransferFunds } from '../pages/transfer-funds';
import { BillPay } from '../pages/bill-pay-page';
import { FindTransactions } from '../pages/find-transactions-page';

test('Parabank Application', async ({ page }) => {
    const userDetails = createUserDetails();
    const registrationPage = new RegistrationPage(page);
    const accountsPage = new AccountsPage(page);
    const transferFunds = new TransferFunds(page);
    const billPay = new BillPay(page);
    const findTransaction = new FindTransactions(page);
    
    let accountNumber1: any;
    let accountNumber2: any;
    let newAccountBalanceAmount: number; 
    let newAccountBalanceText: string;
    const transferAmount: number = 50;
    const billPaymentAmount: number = 20;
    let balance: any;
    let balanceAmount: any;

    
    await test.step('1. Navigate to Parabank', async () => {
        await registrationPage.gotoParabankApplication();
    });

    await test.step('2. Register new user on Parabank', async () => {
        await registrationPage.gotoParabankApplication();
        await registrationPage.clickRegisterLink();
        await registrationPage.register(userDetails);
        await registrationPage.clickRegisterVerifySuccess(userDetails);
        await registrationPage.logoutLink.click();
    });

    await test.step('3. Login with newly registered user', async () => {
        await registrationPage.loginToParabank(userDetails);
        
        await accountsPage.openAccountsOverviewPage();
        accountNumber1 = await accountsPage.getAccountNumber();
        console.log(`:: Main Account Number 1: ${accountNumber1}`);
    });

    await test.step('4. Verify all global navigation menus and its titles', async () => {
        await accountsPage.verifyAllMenuPages();
    });

    await test.step('5. Create a savings account', async () => {
        newAccountBalanceAmount = await accountsPage.createSavingsAccount(accountNumber1);
        newAccountBalanceText = `$${newAccountBalanceAmount}.00`;
        accountNumber2 = await accountsPage.getNewAccountNumber();
    });

    await test.step('6. Validate New Account in Account Overview', async () => {
        await accountsPage.openAccountsOverviewPage();
        await accountsPage.validateNewAccountBalance(accountNumber2, newAccountBalanceText);
    });

    await test.step('7. Transfer funds and verify transfer in accounts overview', async () => {
        await transferFunds.openTransferFundsPage();
        await transferFunds.transferFunds(accountNumber2, accountNumber1, transferAmount.toString());
        balance = `$${newAccountBalanceAmount - transferAmount}.00`;
        balanceAmount = newAccountBalanceAmount - transferAmount;
        await accountsPage.openAccountsOverviewPage();
        await accountsPage.validateNewAccountBalance(accountNumber2, balance);
    });

    await test.step('8. Pay Bill wiith new account', async () => {
        await billPay.openBillPayPage();
        await billPay.payBill(userDetails, accountNumber2, billPaymentAmount); 
        balance = `$${balanceAmount - billPaymentAmount}.00`;
        await accountsPage.openAccountsOverviewPage();
        await accountsPage.validateNewAccountBalance(accountNumber2, balance);
    });

    await test.step('Find transactions on UI and validate API intercept', async () => {
        await findTransaction.findTransactionsByAmountAndValidateAPI(accountNumber2, billPaymentAmount);
    });

    await test.step('1. API - Search the transactions using Find transactions API call by amount for the transfer', async () => {
        await findTransaction.findTransactionsByAPI(accountNumber2, billPaymentAmount, page);
    });

    await test.step('Logout from Parabank Application', async () => {
        await registrationPage.Logout();
    });

});