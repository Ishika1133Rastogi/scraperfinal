const Base = require("../model/selector");
const Quote = require("../model/quotes");
const scrapeData = require("../utils/scrapeData");
const updateScrapedDataItem = require("../utils/updateChecked");
const scrape = require("../utils/scraper1");
const paginatedData = require("../utils/paginated")

const fs = require("fs");

let globalBaseUrl = "";
exports.getBaseData = async (req, res) => {
  // code for retrieving Base data
  const baseUrl = req.query.BASE_URL;
  globalBaseUrl = baseUrl;
  try {
    let doc = await Base.findOne({ BASE_URL: baseUrl });
    if (!doc) {
      const visitedUrls = new Set();
      const urls2 = await scrape(baseUrl, null, new URL(baseUrl), visitedUrls);
      setTimeout(async () => {
        fs.readFile("output.txt", "utf8", async (err, data) => {
          if (err) {
            console.error("Error reading output file:", err);
            return res.status(500).json({ error: "Error reading output file" });
          }
          const urls = data.split("\n").filter(Boolean);
          // Extract the first URL as BASE_URL
          const BASE_URL = globalBaseUrl;
          // Create a new document with BASE_URL and scrapedData
          const newBase = new Base({
            BASE_URL,
            scrapedData: urls.map((url) => ({ url: url.trim() })),
          });
          // Save the new document to MongoDB
          try {
            await newBase.save();
            console.log("Data saved to MongoDB");
            fs.unlink("output.txt", (err) => {
              if (err) {
                console.error("Error deleting output file:", err);
              } else {
                console.log("Output file deleted");
              }
            });
            return res.status(200).json(newBase); // Return the newly created document
          } catch (error) {
            console.error("Error saving data to MongoDB:", error);
            return res
              .status(500)
              .json({ error: "Error saving data to MongoDB" });
          }
        });
      }, 35000);
      // clearTimeout(timeset);
    } else {
      return res.status(200).json(doc); // Return the existing document
    }
  } catch (error) {
    console.error("Error searching for document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateIsChecked = async (req, res) => {
  // this code for updating isChecked field
  const id = req.body.id;
  const isChecked = req.body.isChecked;
  
  try {
    updateScrapedDataItem(id, isChecked);
    res.status(200).json({
      success: "123",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.scrapes = async (req, res) => {
  res.json({ message: "Selector added successfully" });
};

exports.scrapData = async (req, res) => {
  // this code for scraping data
  const urls=req.body.globalDataArray;
  if (!urls.length ) {
    return res.status(400).json({ error: "No URLs or selectors found" });
  }
  const scrapedData = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i][0];
    const selector = urls[i][1];
    const paginatedSelector = urls[i][2];
 
    if(paginatedSelector){
      const data = await paginatedData(url, selector, paginatedSelector);
      if (data) {
      scrapedData.push({ url, data});
    }
    }
    else{
      const data = await scrapeData(url, [selector]);
      if (data) {
        scrapedData.push({ url, data });
      }
    } 
}
  // this code for generating text file in JSON format
  const output = JSON.stringify(scrapedData, null, 2);
  fs.writeFileSync("text1.txt", output, "utf-8");
  res.json({ message: "Scraping completed successfully", data: scrapedData });

  fs.readFile("text1.txt", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    try {
      const jsonData = JSON.parse(data);

      if (!Array.isArray(jsonData)) {
        console.error("Invalid data format: JSON data is not an array");
        return;
      }

      for (const item of jsonData) {
        const { url, data: dataArray } = item;

        const formattedData = dataArray.flatMap((obj) => {
          return Object.entries(obj).map(([selector, values]) => ({
            selector,
            values,
          }));
        });
        try {
          const existingDoc = await Quote.findOne({ BaseUrl: globalBaseUrl });

          if (existingDoc) {
            existingDoc.selectorData.push({ url, data: formattedData });
            await existingDoc.save();
          } else {
            await Quote.create({
              BaseUrl: globalBaseUrl,
              selectorData: [{ url, data: formattedData }],
            });
          }
        } catch (error) {
          console.error(`Error updating/saving data for URL '${url}':`, error);
        }
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  });
};
