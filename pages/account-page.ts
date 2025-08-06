import { expect, Locator, Page } from '@playwright/test';
import { CommonComponents } from './common-components';
import { AccountsOverviewPageConstants, OpenAccountPageConstants } from '../data/constants';


export class AccountsPage extends CommonComponents{
    private accountRows: Locator;
    private selectAccountTypeDropdown: Locator;
    private selectFromAccountDropdown: Locator;
    private openNewAccountButton: Locator;
    private accountNumber: Locator;
    private amountTransferredText: Locator;

    constructor(page: Page) {
        super(page);
        this.accountRows = this.page.locator('#accountTable tbody tr');
        this.selectAccountTypeDropdown = this.page.locator('select#type');
        this.selectFromAccountDropdown = this.page.locator('select#fromAccountId');
        this.openNewAccountButton = this.page.locator('input[value="Open New Account"]');
        this.accountNumber = this.page.locator('#rightPanel p #newAccountId');
        this.amountTransferredText = this.page.getByText('A minimum of');
    }

    async openAccountsOverviewPage() {
        await this.leftMenu.filter({ hasText: AccountsOverviewPageConstants.MENU_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + AccountsOverviewPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(AccountsOverviewPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1.filter( { hasText: AccountsOverviewPageConstants.HEADER_TEXT})).toBeVisible();
    }

    async openNewAccountsOverviewPage() {
        await this.leftMenu.filter({ hasText: OpenAccountPageConstants.MENU_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + OpenAccountPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(OpenAccountPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1.filter( { hasText: OpenAccountPageConstants.HEADER_TEXT})).toBeVisible();
    }

    async getAccountNumber(): Promise<string | null> {
        return await this.accountRows.nth(0).locator('td').nth(0).textContent();
    }

    async createSavingsAccount(accountNumber: string): Promise<number>  {
        await this.openNewAccountsOverviewPage();
        await this.selectAccountTypeDropdown.selectOption('SAVINGS');
        await this.selectFromAccountDropdown.selectOption(accountNumber);
        let amountTransferred: any = await this.getAmountTransferred();
        await this.openNewAccountButton.click();
        await expect(this.headerRightPanel1.filter({ hasText: OpenAccountPageConstants.SUCCESS_MESSAGE })).toBeVisible();
        const newAccountId = await this.page.locator('#rightPanel p #newAccountId').textContent();
        console.log(`:: New Savings Account Number: ${newAccountId}`);
        await expect(this.headerRightPanel1.filter({ hasText: 'Account Opened!'})).toBeVisible();
        return amountTransferred;
    }

    async getAmountTransferred(): Promise<number> {
        let amountTransferred: any = await this.amountTransferredText.textContent();
        const amountText = amountTransferred.match(/\$[0-9,]+(\.[0-9]{2})?/);
        const amount = amountText[0].replace('$', '').replace(/,/g, '');
        return parseInt(amount);
    }

    async getNewAccountNumber(): Promise<string | null> {
        return await this.page.locator('#rightPanel p #newAccountId').textContent();
    }

    async validateNewAccountBalance(accountNumber: string, expectedBalance: string) {
        await expect(this.accountRows).toHaveCount(3);
        await expect(this.accountRows.filter({ hasText: accountNumber }).locator('td').nth(1)).toHaveText(expectedBalance);
        await expect(this.accountRows.filter({ hasText: accountNumber }).locator('td').nth(2)).toHaveText(expectedBalance);
    }

}