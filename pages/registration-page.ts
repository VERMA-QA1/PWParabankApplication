import { expect, Locator, Page } from '@playwright/test';
import { CommonComponents } from './common-components';
import { UserDetails } from '../data/user-details';
import { RegistrationPageConstants } from '../data/constants';


export class RegistrationPage extends CommonComponents{
    readonly registerLink: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly streetTextbox: Locator;
    readonly cityTextbox: Locator;
    readonly stateTextbox: Locator;
    readonly zipcodeTextbox: Locator;
    readonly phoneTextbox: Locator;
    readonly ssnTextbox: Locator;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly confirmPasswordTextbox: Locator;
    readonly registerButton: Locator;

    constructor(page: Page) {
        super(page);

        this.registerLink = this.page.locator('p > a');
        this.firstNameTextbox = this.page.locator('input[name="customer.firstName"]');
        this.lastNameTextbox = this.page.locator('input[name="customer.lastName"]');
        this.streetTextbox = this.page.locator('input[name="customer.address.street"]');
        this.cityTextbox = this.page.locator('input[name="customer.address.city"]');
        this.stateTextbox = this.page.locator('input[name="customer.address.state"]');
        this.zipcodeTextbox = this.page.locator('input[name="customer.address.zipCode"]');
        this.phoneTextbox = this.page.locator('input[name="customer.phoneNumber"]');
        this.ssnTextbox = this.page.locator('input[name="customer.ssn"]');
        this.usernameTextbox = this.page.locator('input[name="customer.username"]');
        this.passwordTextbox = this.page.locator('input[name="customer.password"]');
        this.confirmPasswordTextbox = this.page.locator('input[name="repeatedPassword"]');
        this.registerButton = this.page.locator('tr input[type="submit"]');
    }

    async clickRegisterLink() {
        await this.registerLink.filter({ hasText: RegistrationPageConstants.LINK_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + RegistrationPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(RegistrationPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1).toHaveText(RegistrationPageConstants.HEADER_TEXT);
    }

    async register(userDetails: UserDetails) {
        await this.firstNameTextbox.fill(userDetails.firstName);
        await this.lastNameTextbox.fill(userDetails.lastName);
        await this.streetTextbox.fill(userDetails.street);
        await this.cityTextbox.fill(userDetails.city);
        await this.stateTextbox.fill(userDetails.state);
        await this.zipcodeTextbox.fill(userDetails.zipCode);
        await this.phoneTextbox.fill(userDetails.phoneNumber);
        await this.ssnTextbox.fill(userDetails.ssn);
        await this.usernameTextbox.fill(userDetails.username);
        await this.passwordTextbox.fill(userDetails.password);
        await this.confirmPasswordTextbox.fill(userDetails.repeatedPassword);
    }

    async clickRegisterVerifySuccess(userDetails: UserDetails) {
        await this.registerButton.click();
        await expect(this.page.locator('h1')).toHaveText(`Welcome ${userDetails.username}`);
        await expect(this.page.locator('#rightPanel p')
            .filter({ hasText: 'Your account was created successfully. You are now logged in.'}))
                .toBeVisible();
    }
}