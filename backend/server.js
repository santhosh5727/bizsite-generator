const express = require("express");
const cors = require("cors");
const generateWebsite = require("./generateSite");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const html = await generateWebsite(req.body);
    res.json({ success: true, html });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
