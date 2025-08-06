import { expect, Locator, Page } from '@playwright/test';
import { CommonComponents } from './common-components';
import { TransferFundsPageConstants } from '../data/constants';

export class TransferFunds extends CommonComponents {
    private amountTextbox: Locator;
    private fromAccountDropdown: Locator;
    private toAccountDropdown: Locator;
    private TransferFundsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.amountTextbox = page.locator('input#amount');
        this.fromAccountDropdown = page.locator('select#fromAccountId');
        this.toAccountDropdown = page.locator('select#toAccountId');
        this.TransferFundsButton = page.locator('input[type="submit"]');
    }

    async openTransferFundsPage() {
        await this.leftMenu.filter({ hasText: TransferFundsPageConstants.MENU_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + TransferFundsPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(TransferFundsPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1.filter({ hasText: TransferFundsPageConstants.HEADER_TEXT })).toBeVisible();
    }

    async transferFunds(fromAccount: string, toAccount: string, amount: string) {
        await this.fromAccountDropdown.selectOption(fromAccount);
        await this.toAccountDropdown.selectOption(toAccount);
        await this.amountTextbox.fill(amount);
        await this.TransferFundsButton.click();
        await expect(this.headerRightPanel1.filter({ hasText: TransferFundsPageConstants.SUCCESS_MESSAGE })).toBeVisible();
    }

}