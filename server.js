// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

let enquiries = []; // In-memory storage

// ✅ Allow requests from your frontend
app.use(cors({
  origin: "https://ratnadeepbose.github.io"
}));

app.use(bodyParser.json());

// ✅ Enquiry endpoint
app.post("/enquiry", (req, res) => {
  const { name, email, phone, studentClass, subject, message } = req.body;

  if (!name || !email || !phone || !studentClass || !subject || !message) {
    return res.status(400).json({ status: "error", message: "All fields are required" });
  }

  const enquiry = {
    name,
    email,
    phone,
    class: studentClass, // ✅ store class properly
    subject,
    message,
    date: new Date()
  };

  enquiries.push(enquiry);
  console.log("New enquiry received:", enquiry);
  res.json({ status: "success", message: "Enquiry received!" });
});

// ✅ Beautiful HTML Table for /enquiries
app.get("/enquiries", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SmartLearn Enquiries</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7; }
          h1 { text-align: center; }
          table { border-collapse: collapse; width: 100%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #222; color: white; }
          tr:nth-child(even) { background: #f2f2f2; }
          .class-6-8 { background-color: #d4f7d4; } /* Green for 6-8 */
          .class-9-10 { background-color: #d4e8f7; } /* Blue for 9-10 */
          .class-11-12 { background-color: #fff1d6; } /* Orange for 11-12 */
          .missing { color: red; font-weight: bold; }
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
          ${enquiries.map(e => `
            <tr class="${
              e.class >= 6 && e.class <= 8 ? "class-6-8" :
              e.class >= 9 && e.class <= 10 ? "class-9-10" :
              e.class >= 11 && e.class <= 12 ? "class-11-12" : ""
            }">
              <td>${e.name || '<span class="missing">❌</span>'}</td>
              <td>${e.email || '<span class="missing">❌</span>'}</td>
              <td>${e.phone || '<span class="missing">❌</span>'}</td>
              <td>${e.class || '<span class="missing">❌</span>'}</td>
              <td>${e.subject || '<span class="missing">❌</span>'}</td>
              <td>${e.message || '<span class="missing">❌</span>'}</td>
              <td>${new Date(e.date).toLocaleString()}</td>
            </tr>
          `).join("")}
        </table>
      </body>
    </html>
  `);
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("SmartLearn Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
