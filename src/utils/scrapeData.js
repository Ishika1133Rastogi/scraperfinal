const axios = require("axios");
const cheerio = require("cheerio");

//Code for scrape data by selecting selector corresponding to url
async function scrapeData(url, selector) {
  try {
    const response = await axios.get(url);
    let pages = [];
    const $ = cheerio.load(response.data);
    let pageData = {};
    selector.forEach((selector) => {
      let values = [];
      $(selector).each((index, element) => {
        values.push($(element).text().trim());
      });
      pageData[selector] = values;
    });

    pages.push(pageData);
    return pages;
  } catch (error) {
    console.error("Error scraping URL:", url, error);
    return null;
  }
}

module.exports = scrapeData;
