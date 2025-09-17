// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from frontend
app.use(cors({
  origin: "https://ratnadeepbose.github.io"
}));

app.use(bodyParser.json());

// Enquiry endpoint - save to file
app.post("/enquiry", (req, res) => {
  const { name, email, message } = req.body;

  if(!name || !email || !message){
    return res.status(400).json({ status: "error", message: "All fields required" });
  }

  // Read existing enquiries
  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch (err) {
    enquiries = [];
  }

  // Add new enquiry
  enquiries.push({ name, email, message, date: new Date().toISOString() });

  // Save back to file
  fs.writeFileSync("enquiries.json", JSON.stringify(enquiries, null, 2));

  console.log("Enquiry received:", req.body);
  res.json({ status: "success", message: "Enquiry saved!" });
});

// Endpoint to fetch all enquiries
app.get("/enquiries", (req, res) => {
  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch (err) {
    enquiries = [];
  }

  res.json(enquiries);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("SmartLearn Backend is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
