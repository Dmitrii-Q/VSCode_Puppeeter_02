const { BeforeAll, AfterAll } = require('cucumber');
const puppeteer = require('puppeteer');

let browser, page;

BeforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

AfterAll(async () => {
  await browser.close();
});

module.exports = { page };
