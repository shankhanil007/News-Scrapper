var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
var app = express();
const puppeteer = require("puppeteer");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

  var url = "https://www.indiatoday.in";

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //   await page.screenshot({path: 'example.png'});

    var URL_data = await page.evaluate(() =>
      Array.from(document.querySelector('ul.itg-listing').getElementsByTagName("li"))
        .map(compact => ({
          url: url + compact.querySelector("a").getAttribute("href")
        }))
    )
    await browser.close();
  })();



});

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
