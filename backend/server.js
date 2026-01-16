const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require("./routes/Leads");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.get("/", (req, res) => {
  res.send("API is working!");
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

module.exports = app;
