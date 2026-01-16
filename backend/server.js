const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const leadRoutes = require("./routes/Leads");
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

module.exports = app;
