var express = require("express");
var bodyParser = require("body-parser");
const request = require("request");
var app = express();
var async = require("async");
const puppeteer = require("puppeteer");
app.use(bodyParser.urlencoded({ extended: true }));


var URL_data = [];

app.get("/", function (req, res) {

  var url = "https://www.indiatoday.in";

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //   await page.screenshot({path: 'example.png'});

    URL_data = await page.evaluate(() =>
      Array.from(document.querySelector('ul.itg-listing').getElementsByTagName("li"))
        .map(compact => ({
          url: "https://www.indiatoday.in" + compact.querySelector("a").getAttribute("href")
        }))
    )


    // console.log(URL_data);

    await browser.close();
  })();
});








app.get("/news", function (req, res) {

  var arr = [];

  function doA(i) {
    return new Promise((resolve) => {
      var url = URL_data[i].url;
      //console.log(url);
      (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        //   await page.screenshot({path: 'example.png'});

        var news_data = await page.evaluate(() => ({
          headline: document.querySelector("h1") === null ? " " : document.querySelector("h1").innerText,
          text: document.querySelector("div.description") === null ? " " : document.querySelector("div.description").innerText
        })
        )
        //console.log(news_data);
        arr[i] = news_data;
        await browser.close();
      })();

      setTimeout(() => {
        resolve(arr);
      }, 10000);
    });

  }

  async function main() {
    for (var i = 0; i < URL_data.length; i++) {
      const result = await doA(i);
    }

    // for (var i = 0; i < arr.length; i++) {
    //   console.log(arr[i]);
    // }

    console.log(arr.length);
    res.render('x.ejs', { data: arr });
  }

  main();


});




app.listen(3000, function () {
  console.log("Server listening on port 3000");
});






// var arr = [];

//     function doA(i) {
//       return new Promise((resolve) => {
//         url = URL_data[i].url;
//         //console.log(url);
//         (async () => {
//           const browser = await puppeteer.launch();
//           const page = await browser.newPage();
//           await page.goto(url);
//           //   await page.screenshot({path: 'example.png'});

//           var news_data = await page.evaluate(() => ({
//             headline: document.querySelector("h1") === null ? " " : document.querySelector("h1").innerText,
//             text: document.querySelector("div.description") === null ? " " : document.querySelector("div.description").innerText
//           })
//           )
//           //console.log(news_data);
//           arr[i] = news_data;
//           await browser.close();
//         })();

//         setTimeout(() => {
//           resolve(arr);
//         }, 10000);
//       });

//       // console.log("hello");
//     }

//     async function main() {
//       for (var i = 0; i < URL_data.length; i++) {
//         const result = await doA(i);
//       }

//       // for (var i = 0; i < arr.length; i++) {
//       //   console.log(arr[i]);
//       // }

//       console.log(arr.length);
//       res.render('x.ejs', { data: arr });
//     }

//     main();
