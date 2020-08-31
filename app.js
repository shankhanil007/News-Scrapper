var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
var app = express();
const puppeteer = require("puppeteer");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  console.log("Hello");
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    await page.screenshot({ path: "example.png" });

    await browser.close();
  })();
});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
