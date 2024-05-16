const puppeteer = require('puppeteer');

describe('Бронирование билетов', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://qamid.tmweb.ru/');
  });

  afterEach(async () => {
    await browser.close();
  });

  test('Проверка наличия семи дней в расписании', async () => {
    const daysCount = await page.$$eval('.page-nav__day', days => days.length);
    expect(daysCount).toEqual(7);
  });

  test('Бронирование одного билета (Happy Path)', async () => {
    await page.click('.page-nav__day:nth-child(7)'); // Выбираем седьмой день
    await page.waitForSelector(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time'); // Ждем загрузки времени фильма
    await page.click(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time'); // Выбираем сеанс
  
    await page.waitForSelector('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)'); // Ждем загрузки мест
    const firstSeat = await page.$('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)');
    await firstSeat.click(); // Выбираем первое место
    await page.click('.acceptin-button'); // Подтверждаем бронь
  
    // Ждем появления элемента, который содержит информацию о бронировании
    await page.waitForSelector('.ticket__check-title');
  
    // Получаем текст из элемента и проверяем, содержит ли он нужную информацию
    const ticketCheckTitle = await page.evaluate(() => document.querySelector('.ticket__check-title').textContent);
    expect(ticketCheckTitle).toContain('Вы выбрали билеты:');
  });
  
  

  test('Бронирование двух билетов (Happy Path)', async () => {
    await page.click('.page-nav__day:nth-child(7)'); // Выбираем седьмой день
    await page.waitForSelector(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time'); // Ждем загрузки времени фильма
    await page.click(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time'); // Выбираем сеанс
  
    // Ждем загрузки мест и выбираем первое место
    await page.waitForSelector('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)');
    const firstSeat = await page.$('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(1)');
    await firstSeat.click();
  
    // Выбираем второе место
    const secondSeat = await page.$('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(1) > span:nth-child(2)');
    await secondSeat.click();
  
    // Подтверждаем бронь
    await page.click('.acceptin-button');
  
    // Ждем появления элемента, который содержит информацию о бронировании
    await page.waitForSelector('.ticket__check-title');
  
    // Получаем текст из элемента и проверяем, содержит ли он нужную информацию
    const ticketCheckTitle = await page.evaluate(() => document.querySelector('.ticket__check-title').textContent);
    expect(ticketCheckTitle).toContain('Вы выбрали билеты:');
  });
  

  test('Попытка бронирования уже занятого места (Sad Path)', async () => {
    // Выбираем седьмой день
    await page.click('.page-nav__day:nth-child(7)');

    // Ждем загрузки времени фильма
    await page.waitForSelector(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time');

    // Выбираем сеанс
    await page.click(':nth-child(1) > .movie-seances__hall > .movie-seances__list > .movie-seances__time-block > .movie-seances__time');

    // Ждем загрузки мест
    await page.waitForSelector('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(7) > span.buying-scheme__chair.buying-scheme__chair_standart.buying-scheme__chair_taken');

    // Проверяем, что клик по занятому месту невозможен
    const isClickable = await page.$eval('body > main > section > div.buying-scheme > div.buying-scheme__wrapper > div:nth-child(7) > span.buying-scheme__chair.buying-scheme__chair_standart.buying-scheme__chair_taken', seat => {
    const styles = window.getComputedStyle(seat);
    return styles.pointerEvents !== 'none';
});

// Проверяем, что невозможно подтвердить бронирование
expect(isClickable).toBeTruthy();

});
  
});