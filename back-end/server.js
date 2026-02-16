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
});