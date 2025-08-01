import { expect, Locator, Page } from '@playwright/test';
import { AccountsOverviewPageConstants, LoginPageConstants, navItems } from '../data/constants';
import { UserDetails } from '../data/user-details';

export class CommonComponents {
    public page: Page;
    readonly rootUrl: string;

    readonly headerRightPanel1: Locator;
    readonly headerLeftPanel2: Locator;
    readonly usernameLoginTextbox: Locator;
    readonly passwordLoginTextbox: Locator;
    readonly loginButton: Locator;
    readonly logoutLink: Locator;
    readonly leftMenu: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rootUrl = 'https://parabank.parasoft.com/';
        this.headerRightPanel1 = page.locator('#rightPanel h1');
        this.headerLeftPanel2 = page.locator('#leftPanel h2');
        this.usernameLoginTextbox = page.locator('input[name="username"]');
        this.passwordLoginTextbox = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[type="submit"]');
        this.logoutLink = page.locator('#leftPanel ul > li > a').filter({ hasText: 'Log Out' });
        this.leftMenu = page.locator('#leftPanel > ul > li > a');
    }

    async gotoParabankApplication() {
        await this.page.goto('/');
        await expect(this.headerLeftPanel2.filter({ hasText: LoginPageConstants.HEADER_TEXT })).toBeVisible();
        await expect(this.page.url()).toContain(LoginPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(LoginPageConstants.PAGE_TITLE);
    }

    async loginToParabank(userDetails: UserDetails) {
        await this.usernameLoginTextbox.fill(userDetails.username);
        await this.passwordLoginTextbox.fill(userDetails.password);
        await this.loginButton.click();
        await expect(this.headerRightPanel1.filter({ hasText: AccountsOverviewPageConstants.HEADER_TEXT })).toBeVisible();
    }

    async Logout() {
        await this.logoutLink.click();
        await expect(this.headerLeftPanel2).toHaveText(LoginPageConstants.HEADER_TEXT);
    }

    async verifyAllMenuPages() {  
        for (const [linkText, expectedHeading] of Object.entries(navItems)) {
            await this.leftMenu.filter({ hasText: linkText }).click();
            await expect(this.headerRightPanel1.filter({ hasText: expectedHeading})).toBeVisible();
        }
    }

}