const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create an array named groupedNumbers', async function() {
    const groupedNumbers = await page.evaluate(() => groupedNumbers);
    expect(groupedNumbers).toBeDefined();
  });

  it('should add an array containing 1, 3, and 5 to groupedNumbers', async function() {
    const groupedNumbers = await page.evaluate(() => groupedNumbers);
    let odds = groupedNumbers[0]
    expect(odds.length).toBe(3);
    expect(odds[0]).toBe(1);
    expect(odds[1]).toBe(3);
    expect(odds[2]).toBe(5);
  });

  it('should add an array containing 2, 4, and 6 to groupedNumbers', async function() {
    const groupedNumbers = await page.evaluate(() => groupedNumbers);
    let evens = groupedNumbers[1]
    expect(evens.length).toBe(3);
    expect(evens[0]).toBe(2);
    expect(evens[1]).toBe(4);
    expect(evens[2]).toBe(6);
  });

  it('should assign the innerHTML of the HTML element with the id result to the groupedNumbers', async function() {
    const groupedNumbers = await page.evaluate(() => groupedNumbers);
    const innerHtml = await page.$eval("#result", (result) => {
      return result.innerHTML;
    });
    
    expect(innerHtml).toBe(groupedNumbers.toString());
  });
});
