// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let enquiries = [];

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
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 20px;
            background: #f5f7fa;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #1a1a1a;
          }
          .table-container {
            overflow-x: auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          }
          table {
            border-collapse: collapse;
            width: 100%;
            min-width: 900px;
          }
          th, td {
            padding: 14px;
            border-bottom: 1px solid #eee;
            text-align: left;
            font-size: 15px;
          }
          th {
            background: #222;
            color: white;
            position: sticky;
            top: 0;
          }
          tr:hover {
            background-color: rgba(0, 0, 0, 0.05);
            transition: background 0.2s ease-in-out;
          }

          /* 🎨 Class Colors */
          .class-6  { background-color: #e8fbe8; }
          .class-7  { background-color: #dbffe8; }
          .class-8  { background-color: #d0faff; }
          .class-9  { background-color: #e3eaff; }
          .class-10 { background-color: #ece0ff; }
          .class-11 { background-color: #fff0d1; }
          .class-12 { background-color: #ffe5e5; }
          .class-na { background-color: #fffde7; }

          /* 🎨 Subject Colors (applied to subject cell only) */
          td.subject-history { color: #795548; font-weight: bold; }
          td.subject-geography { color: #1565c0; font-weight: bold; }
          td.subject-english-language { color: #2e7d32; font-weight: bold; }
          td.subject-english-literature { color: #4e342e; font-weight: bold; }
          td.subject-multiple { color: #6a1b9a; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>📋 SmartLearn Enquiries</h1>
        <div class="table-container">
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
            let normalizedClass = "na";
            if (e.class) {
              normalizedClass = e.class.toString().trim().toLowerCase().replace(/\s+/g, "-");
            }

            let normalizedSubject = e.subject
              ? e.subject.toString().trim().toLowerCase().replace(/\s+/g, "-")
              : "none";

            return `
              <tr class="class-${normalizedClass}">
                <td>${e.name}</td>
                <td>${e.email}</td>
                <td>${e.phone}</td>
                <td>${e.class}</td>
                <td class="subject-${normalizedSubject}">${e.subject}</td>
                <td>${e.message}</td>
                <td>${new Date(e.date).toLocaleString()}</td>
              </tr>
            `;
          }).join("")}
        </table>
        </div>
      </body>
    </html>
  `);
});

app.get("/", (req, res) => {
  res.send("SmartLearn Backend is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
