<<<<<<< HEAD
console.log("🔥 SERVER.JS LOADED");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// CONFIG SQL SERVER
// ================================
app.use(express.static(path.join(__dirname, "../front-end")));
const dbConfig = {
  user: "sa",
  password: "StrongPass123!",
  server: "127.0.0.1",
  port: 1433,
  database: "ThaiPBS_DB", // ใส่ไว้ได้ ถ้ายังไม่มีเดี๋ยวผมบอกวิธีสร้าง
  options: {
    encrypt: false,               // ⭐ ต้องมี
    trustServerCertificate: true, // ⭐ ต้องมี
  },
};

// ================================
// TEST API
// ================================
app.get("/", (req, res) => {
  res.send("API is running");
});

// ================================
// API: ดึงข้อมูลข่าวทั้งหมด
// ================================
app.get("/api/news", async (req, res) => {
  try {
    sql.close();
    await sql.connect(dbConfig);
    const result = await sql.query("SELECT * FROM dbo.News");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// API: ดึงข่าวตาม ID
// ================================
app.get("/api/news/:id", async (req, res) => {
  try {
    sql.close();
    await sql.connect(dbConfig);

    const request = new sql.Request();
    request.input("id", sql.Int, req.params.id);

    const result = await request.query(
      "SELECT * FROM dbo.News WHERE id = @id"
    );

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// ✅ API: ค้นหาคนหาย
// ================================
app.get("/api/missing-persons", async (req, res) => {
  const { month, name } = req.query;

  try {
    sql.close();
    await sql.connect(dbConfig);

    let query = `
      SELECT *
      FROM MissingPerson
      WHERE 1=1
    `;

    const request = new sql.Request();

    if (month) {
      query += " AND missing_month = @month";
      request.input("month", sql.Int, month);
    }

    if (name) {
      query += " AND missing_name LIKE @name";
      request.input("name", sql.NVarChar, `%${name}%`);
    }

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// START SERVER
// ================================
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
=======
const express = require("express");
const cors = require("cors");

const missingRoutes = require("./routes/missing.routes");

const app = express();

app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("API is running");
});

// เชื่อม route
app.use("/api/missing-persons", missingRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
>>>>>>> 15fa46ab1bb4019682ecbaa42cd2d395a2182132
});