// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let enquiries = []; // Memory storage

app.use(cors({ origin: "https://ratnadeepbose.github.io" }));
app.use(bodyParser.json());

app.post("/enquiry", (req, res) => {
  const { name, email, phone, studentClass, subject, message } = req.body;

  if (!name || !email || !phone || !studentClass || !subject || !message) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  const enquiry = {
    name,
    email,
    phone,
    class: studentClass,
    subject,
    message,
    date: new Date()
  };

  enquiries.push(enquiry);
  console.log("✅ New Enquiry:", enquiry);
  res.json({ status: "success", message: "Enquiry received successfully!" });
});

app.get("/enquiries", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SmartLearn Enquiries</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f7f7f7;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          th, td {
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #222;
            color: white;
          }
          tr:nth-child(even) { background: #f9f9f9; }

          /* 🎨 Class-based Colors */
          .class-6 { background-color: #d6f7d6; } /* Light Green */
          .class-7 { background-color: #bfffd4; } /* Mint Green */
          .class-8 { background-color: #aff7ef; } /* Aqua */
          .class-9 { background-color: #d6e4ff; } /* Light Blue */
          .class-10 { background-color: #d9c6ff; } /* Lavender */
          .class-11 { background-color: #ffe4b2; } /* Light Orange */
          .class-12 { background-color: #ffcccc; } /* Soft Red */

          .missing {
            color: red;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h1>📋 SmartLearn Enquiries</h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
          ${enquiries.map(e => {
            const cls = e.class ? `class-${e.class}` : "";
            return `
              <tr class="${cls}">
                <td>${e.name || '<span class="missing">❌</span>'}</td>
                <td>${e.email || '<span class="missing">❌</span>'}</td>
                <td>${e.phone || '<span class="missing">❌</span>'}</td>
                <td>${e.class || '<span class="missing">❌</span>'}</td>
                <td>${e.subject || '<span class="missing">❌</span>'}</td>
                <td>${e.message || '<span class="missing">❌</span>'}</td>
                <td>${new Date(e.date).toLocaleString()}</td>
              </tr>
            `;
          }).join("")}
        </table>
      </body>
    </html>
  `);
});

app.get("/", (req, res) => {
  res.send("SmartLearn Backend is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
