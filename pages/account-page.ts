import { expect, Locator, Page } from '@playwright/test';
import { CommonComponents } from './common-components';
import { AccountsOverviewPageConstants, OpenAccountPageConstants } from '../data/constants';


export class AccountsPage extends CommonComponents{
    readonly accountRows: Locator;
    readonly selectAccountTypeDropdown: Locator;
    readonly selectFromAccountDropdown: Locator;
    readonly openNewAccountButton: Locator;
    readonly accountNumber: Locator;

    constructor(page: Page) {
        super(page);
        this.accountRows = this.page.locator('#accountTable tbody tr');
        this.selectAccountTypeDropdown = this.page.locator('select#type');
        this.selectFromAccountDropdown = this.page.locator('select#fromAccountId');
        this.openNewAccountButton = this.page.locator('input[value="Open New Account"]');
        this.accountNumber = this.page.locator('#rightPanel p #newAccountId');
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

    async createSavingsAccount(accountNumber: string) {
        await this.openNewAccountsOverviewPage();
        await this.selectAccountTypeDropdown.selectOption('SAVINGS');
        await this.selectFromAccountDropdown.selectOption(accountNumber);
        await this.openNewAccountButton.click();
        await expect(this.headerRightPanel1.filter({ hasText: OpenAccountPageConstants.SUCCESS_MESSAGE })).toBeVisible();
        // Verify the account number is displayed in the success message
        const newAccountId = await this.page.locator('#rightPanel p #newAccountId').textContent();
        console.log(`:: New Savings Account Number: ${newAccountId}`);
        await expect(this.headerRightPanel1.filter({ hasText: 'Account Opened!'})).toBeVisible();
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