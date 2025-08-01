import { expect, Locator, Page, request } from '@playwright/test';
import { CommonComponents } from './common-components';
import { FindTransactionsPageConstants } from '../data/constants';
import schema  from '../tests/schema/find-transactions.schema.json';
import { validateSchema } from '../utils/validate-schema';

export class FindTransactions extends CommonComponents {
    readonly selectAccount: Locator;
    readonly findByAmount: Locator;
    readonly findTransactionsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.selectAccount = page.locator('select#accountId');
        this.findByAmount = page.locator('#rightPanel #amount');
        this.findTransactionsButton = page.locator('button#findByAmount');
    }

    async navigateToFindTransactions() {
        await this.leftMenu.filter({ hasText: FindTransactionsPageConstants.MENU_TEXT }).click();
        await expect(this.page).toHaveURL(this.rootUrl + FindTransactionsPageConstants.PAGE_URL);
        await expect(this.page).toHaveTitle(FindTransactionsPageConstants.PAGE_TITLE);
        await expect(this.headerRightPanel1.filter({ hasText: FindTransactionsPageConstants.HEADER_TEXT })).toBeVisible();
    }

    async findTransactionsByAmountAndValidateAPI(accountId: string, amount: number) {
        await this.navigateToFindTransactions();
        await this.selectAccount.selectOption(accountId);
        await this.findByAmount.fill(amount.toString());

        const apiUrlPattern = `amount/${amount}`;
        const [response] = await Promise.all([
            this.page.waitForResponse(resp => !!resp.url().match(apiUrlPattern) && resp.request().method() === 'GET'),
            this.findTransactionsButton.click()
        ]);

        expect(response.ok()).toBeTruthy();
        const responseBody = await response.json();

        expect(responseBody[0]).toHaveProperty('amount', amount);
        expect(responseBody.length).toBeGreaterThan(0);
        validateSchema(responseBody, schema); 
        await expect(this.headerRightPanel1.filter({ hasText: FindTransactionsPageConstants.SUCCESS_MESSAGE })).toBeVisible();
    }

    async findTransactionsByAPI(accountId: string, amount: number, page: Page) {
        const cookies = await page.context().cookies();
        const apiContext = await request.newContext({
            extraHTTPHeaders: {
                cookie: cookies.map(c => `${c.name}=${c.value}`).join('; ')
            }
        });
        const apiUrl = `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}`;
        // const apiContext = await request.newContext();
        const response = await apiContext.get(apiUrl);
        const responseBody = await response.json();
        
        expect(response.ok()).toBeTruthy();

        expect(responseBody[0]).toHaveProperty('amount', amount);
        expect(responseBody.length).toBeGreaterThan(0);
        validateSchema(responseBody, schema); 
    }
}