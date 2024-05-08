const { expect } = require('chai');
const puppeteer = require('puppeteer');

describe('Ticket Booking', () => {
    let browser;
    let page;
  
    beforeEach(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.goto('https://qamid.tmweb.ru/client/index.php');
    });
  
    afterEach(async () => {
      await browser.close();
    });
  
    test('should book one ticket successfully - Happy Path 1', async () => {
      await page.click('body > nav > a.page-nav__day.page-nav__day_chosen');

      await page.click('body > main > section:nth-child(1) > div.movie-seances__hall > ul > li > a');
  
      await page.waitForSelector('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)');
  
      await page.click('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)');
  
      await page.waitForSelector('body > main > section > button');
  
      await page.click('body > main > section > button');
  
      await page.waitForSelector('.alert-success');
  
      const isBooked = await page.$eval('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)', ticket => ticket.classList.contains('buying-scheme__chair_selected'));
      expect(isBooked).toBeTruthy();
    });
    
});
