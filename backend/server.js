const express = require("express");
const cors = require("cors");
const generateWebsite = require("./generateSite");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const html = await generateWebsite(req.body);
    res.json({ success: true, html });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Generation failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
