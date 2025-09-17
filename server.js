// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://ratnadeepbose.github.io"
}));
app.use(bodyParser.json());

// Handle enquiry submissions
app.post("/enquiry", (req, res) => {
  const { name, email, message, className, subject } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ status: "error", message: "All fields required" });
  }

  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch {
    enquiries = [];
  }

  enquiries.push({
    name,
    email,
    message,
    class: className || "N/A",
    subject: subject || "N/A",
    date: new Date().toLocaleString()
  });

  fs.writeFileSync("enquiries.json", JSON.stringify(enquiries, null, 2));

  console.log("✅ New enquiry saved:", req.body);
  res.json({ status: "success", message: "Enquiry saved!" });
});

// Display enquiries in a styled HTML dashboard
app.get("/enquiries", (req, res) => {
  let enquiries = [];
  try {
    enquiries = JSON.parse(fs.readFileSync("enquiries.json"));
  } catch {
    enquiries = [];
  }

  let rows = enquiries.map(e => `
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
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>SmartLearn Enquiries</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f6f8; margin: 0; padding: 20px; }
      .container { max-width: 1000px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
      h1 { text-align: center; color: #27ae60; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px 14px; border-bottom: 1px solid #ddd; text-align: left; }
      th { background: #27ae60; color: white; }
      tr:hover { background: #f9f9f9; }
      .no-data { text-align: center; padding: 20px; color: #888; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📋 SmartLearn Enquiries</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows || `<tr><td colspan="6" class="no-data">No enquiries yet</td></tr>`}
        </tbody>
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
