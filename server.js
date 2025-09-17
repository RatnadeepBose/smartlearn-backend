// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://ratnadeepbose.github.io" // Allow your frontend
}));

app.use(bodyParser.json());

// Save enquiry data
app.post("/enquiry", (req, res) => {
  const { name, email, message, className, subject } = req.body;

  if (!name || !email || !message || !className || !subject) {
    return res.status(400).json({ status: "error", message: "All fields required" });
  }

  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch (err) {
    enquiries = [];
  }

  enquiries.push({
    name,
    email,
    message,
    class: className,
    subject,
    date: new Date().toLocaleString()
  });

  fs.writeFileSync("enquiries.json", JSON.stringify(enquiries, null, 2));

  console.log("Enquiry received:", req.body);
  res.json({ status: "success", message: "Enquiry saved!" });
});

// Show enquiries in a nice HTML table
app.get("/enquiries", (req, res) => {
  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch (err) {
    enquiries = [];
  }

  let tableRows = enquiries.map(e => `
    <tr>
      <td>${e.name}</td>
      <td>${e.email}</td>
      <td>${e.class}</td>
      <td>${e.subject}</td>
      <td>${e.message}</td>
      <td>${e.date}</td>
    </tr>
  `).join("");

  const html = `
  <html>
  <head>
    <title>SmartLearn Enquiries</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px; }
      h1 { text-align: center; color: #2c3e50; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
      th { background-color: #2ecc71; color: white; }
      tr:hover { background-color: #f1f1f1; }
      .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📋 SmartLearn Enquiries</h1>
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Class</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
        ${tableRows || `<tr><td colspan="6" style="text-align:center;">No enquiries yet.</td></tr>`}
      </table>
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ SmartLearn Backend is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
