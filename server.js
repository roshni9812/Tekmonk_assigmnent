
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;


app.get("/", (req, res) => {
  res.send("Welcome to Time News Scraper Assignment!");
});


app.get("/getTimeStories", async (req, res) => {
  try {
    const url = "https://time.com/section/latest/";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    let stories = [];

    $(".latest-stories__item").each((i, el) => {
      const title = $(el).find("h3").text().trim();
      const link = $(el).find("a").attr("href");
      if (title && link) {
        stories.push({
          title,
          link: link.startsWith("http") ? link : `https://time.com${link}`,
        });
      }
    });

    res.json({ count: stories.length, stories });
  } catch (error) {
    console.error("Error fetching stories:", error.message);
    res.status(500).json({ error: "Unable to fetch stories" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
