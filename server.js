// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from frontend
app.use(cors({
  origin: "https://ratnadeepbose.github.io"
}));

app.use(bodyParser.json());

// Enquiry endpoint
app.post("/enquiry", (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message){
    return res.status(400).json({ status: "error", message: "All fields required" });
  }

  console.log("Enquiry received:", req.body);
  res.json({ status: "success", message: "Enquiry received!" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("SmartLearn Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
