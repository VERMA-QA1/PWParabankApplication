import { request, APIRequestContext, Page, expect } from '@playwright/test';

export async function getContextWithCookies(page: Page): Promise<APIRequestContext> {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    return await request.newContext({
        extraHTTPHeaders: {
        cookie: cookieHeader
        }
    });
}


export async function getAPIRequest<T>(
  page: Page,
  url: string,
): Promise<T> {
    const apiContext = await getContextWithCookies(page);
    const response = await apiContext.get(url);

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    return body;
}