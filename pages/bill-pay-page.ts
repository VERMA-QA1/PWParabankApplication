import { expect, Locator, Page } from '@playwright/test';
import { CommonComponents } from './common-components';
import { BillPayPageConstants } from '../data/constants';
import { UserDetails } from '../data/user-details';

export class BillPay extends CommonComponents {
    private payeeNameTextbox: Locator;
    private addressTextbox: Locator;
    private cityTextbox: Locator;
    private stateTextbox: Locator;
    private zipcodeTextbox: Locator;
    private phoneTextbox: Locator;
    private toAccountTextbox: Locator;
    private toAccountConfirmTextbox: Locator;
    private amountTextbox: Locator;
    private fromAccountDropdown: Locator;
    private sendPaymentButton: Locator;

    constructor(page: Page) {
        super(page);
        this.payeeNameTextbox = this.page.locator('#billpayForm input[name="payee.name"]');
        this.addressTextbox = this.page.locator('#billpayForm input[name="payee.address.street"]');
        this.cityTextbox = this.page.locator('#billpayForm input[name="payee.address.city"]');
        this.stateTextbox = this.page.locator('#billpayForm input[name="payee.address.state"]');
        this.zipcodeTextbox = this.page.locator('#billpayForm input[name="payee.address.zipCode"]');
        this.phoneTextbox = this.page.locator('#billpayForm input[name="payee.phoneNumber"]');
        this.toAccountTextbox = this.page.locator('#billpayForm input[name="payee.accountNumber"]');
        this.toAccountConfirmTextbox = this.page.locator('#billpayForm input[name="verifyAccount"]');
        this.amountTextbox = this.page.locator('#billpayForm input[name="amount"]');
        this.fromAccountDropdown = this.page.locator('select[name="fromAccountId"]');
        this.sendPaymentButton = this.page.locator('input[value="Send Payment"]');
    }

    async openBillPayPage() {
        await this.leftMenu.filter({ hasText: BillPayPageConstants.MENU_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + BillPayPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(BillPayPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1.filter({ hasText: BillPayPageConstants.HEADER_TEXT })).toBeVisible();
    }

    async payBill(userDetails: UserDetails, fromAccountNumber: string, billAmount: number = 25) {
        await this.openBillPayPage();  
        
        await this.leftMenu.filter({ hasText: 'Bill Pay' }).click();
        await expect(this.headerRightPanel1.filter({ hasText: 'Bill Payment Service'})).toBeVisible();
        await this.payeeNameTextbox.fill(userDetails.firstName);
        await this.addressTextbox.fill(userDetails.street);
        await this.cityTextbox.fill(userDetails.city);
        await this.stateTextbox.fill(userDetails.state);
        await this.zipcodeTextbox.fill(userDetails.zipCode);
        await this.phoneTextbox.fill(userDetails.phoneNumber);
        await this.toAccountTextbox.fill('123456789');
        await this.toAccountConfirmTextbox.fill('123456789');
        await this.amountTextbox.fill(billAmount.toString());
        await this.fromAccountDropdown.selectOption(fromAccountNumber);        
            
        const apiUrlPattern = 'billpay?';
        const [response] = await Promise.all([
            this.page.waitForResponse(resp => !!resp.url().match(apiUrlPattern) && resp.request().method() === 'POST'),
            this.sendPaymentButton.click()
        ]);

        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();

        expect(responseBody).toMatchObject({
            payeeName: userDetails.firstName, 
            amount: billAmount,
            accountId: Number(fromAccountNumber)
        });

        await expect(this.headerRightPanel1.filter({ hasText: BillPayPageConstants.SUCCESS_MESSAGE })).toBeVisible();
    }

}