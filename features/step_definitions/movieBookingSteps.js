const { Given, When, Then } = require('cucumber');
const { page } = require('../support/hooks');

Given('я открываю страницу {string}', async (url) => {
  await page.goto(url);
});

When('я выбираю {int} день', async (day) => {
  const daySelector = `.page-nav__day:nth-child(${day})`;
  await page.waitForSelector(daySelector);
  await page.click(daySelector);
});

When('я выбираю фильм и время сеанса', async () => {
  // Ваш код для выбора фильма и времени сеанса
  // Например:
  await page.waitForSelector(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time');
  await page.click(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time');
});

When('я выбираю {int} место', async (seatNumber) => {
  const seatSelector = `body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(${seatNumber}) > span:nth-child(${seatNumber})`;
  await page.waitForSelector(seatSelector);
  await page.click(seatSelector);
});

When('я подтверждаю бронь', async () => {
  await page.click('.acceptin-button');
});

Then('я вижу сообщение о бронировании', async () => {
  await page.waitForSelector('.ticket__check-title');
  const bookingMessage = await page.$eval('.ticket__check-title', el => el.textContent);
  expect(bookingMessage).toContain('Вы выбрали билеты:');
});
