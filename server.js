// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://ratnadeepbose.github.io"
}));

app.use(bodyParser.json());

// Temporary in-memory storage
let enquiries = [];

// POST /enquiry - Save enquiry
app.post("/enquiry", (req, res) => {
  const { name, email, phone, class: studentClass, subject, message } = req.body;

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
  console.log("✅ Enquiry received:", enquiry);
  res.json({ status: "success", message: "Enquiry received!" });
});

// GET /enquiries - Show all enquiries in a beautiful table
app.get("/enquiries", (req, res) => {
  const html = `
  <html>
    <head>
      <title>Enquiries - SmartLearnAcademy</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f4f4;
          padding: 20px;
          color: #333;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background: #27ae60;
          color: white;
          text-transform: uppercase;
          font-size: 14px;
        }
        tr:hover {
          background: #f1f1f1;
        }
        .class-6-8 { background-color: #d4edda; }  /* Light green */
        .class-9-10 { background-color: #dbeafe; } /* Light blue */
        .class-11-12 { background-color: #fff3cd; } /* Light yellow */
      </style>
    </head>
    <body>
      <h1>📋 Student Enquiries</h1>
      ${
        enquiries.length === 0 
        ? "<p style='text-align:center;'>No enquiries yet.</p>" 
        : `
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
            let classCategory = "";
            if (["6","7","8"].includes(e.class)) classCategory = "class-6-8";
            else if (["9","10"].includes(e.class)) classCategory = "class-9-10";
            else if (["11","12"].includes(e.class)) classCategory = "class-11-12";

            return `
              <tr class="${classCategory}">
                <td>${e.name}</td>
                <td>${e.email}</td>
                <td>${e.phone}</td>
                <td>${e.class}</td>
                <td>${e.subject}</td>
                <td>${e.message}</td>
                <td>${new Date(e.date).toLocaleString()}</td>
              </tr>`;
          }).join("")}
        </table>`
      }
    </body>
  </html>`;
  
  res.send(html);
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ SmartLearn Backend is running!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
