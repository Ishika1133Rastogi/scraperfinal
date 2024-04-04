const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
PORT = 5002;
app.use(bodyParser.json());
app.use(cors());


const { URL } = require("url");

//function for scrap urls from baseUrl that is given by User
async function scrap(url, parent = null, baseUrl, visitedUrls, limit = 2000) {
  try {
    if (visitedUrls.size >= limit || visitedUrls.has(url)) {
      return [];
    }

    visitedUrls.add(url);
    const absoluteUrl = new URL(url, baseUrl);
    fs.appendFileSync("output.txt", absoluteUrl.href + "\n");

    const response = await axios.get(absoluteUrl.href);
    const $ = cheerio.load(response.data);

    const childUrls = [];
    $("a").each(async (index, element) => {
      const href = $(element).attr("href");
      if (href) {
        const childUrl = new URL(href, absoluteUrl);
        if (childUrl.hostname === baseUrl.hostname) {
          childUrls.push(childUrl.href);
          await scrap(
            childUrl.href,
            absoluteUrl.href,
            baseUrl,
            visitedUrls,
            limit
          );
        }
      }
    });
    return [];
  } catch (error) {
    return [];
  }
}
module.exports = scrap;
