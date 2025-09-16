const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ThingSpeak public channel
const CHANNEL_ID = "3032472";

app.use(cors());

// Endpoint to get latest data
app.get("/api/data", async (req, res) => {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=1`;
    const response = await axios.get(url);

    if (response.data.feeds && response.data.feeds.length > 0) {
      res.json(response.data.feeds[0]); // latest feed
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (err) {
    console.error("Error fetching ThingSpeak data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
