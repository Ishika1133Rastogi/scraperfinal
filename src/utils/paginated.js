const puppeteer = require('puppeteer');


async function paginatedData(url, selector, paginatedselector) {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
  
        await page.goto(url);
  let pages = []
        while (await page.$(paginatedselector)) {
            await page.waitForSelector(selector, { visible: true });
  
            const data = await page.evaluate((selector) => {
                const elements = Array.from(document.querySelectorAll(selector));
                return elements.map(element => element.textContent.trim());
            },selector);
  
            const pageUrl = page.url(); // Get the current URL of the page
            pages.push({ url: pageUrl, data: data }); // Push URL and its scraped data
            console.log("Scraped data for URL:", pageUrl);
  
            const nextButton = await page.$(paginatedselector);
            if (nextButton) {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle0' }),
                    nextButton.click()
                ]);
            } else {
                break;
            }
          }
        await browser.close();      
    return pages;
    } catch (error) {
        console.log("Error scraping URL:", url, error)
        return null;
    }
  }
module.exports = paginatedData;
