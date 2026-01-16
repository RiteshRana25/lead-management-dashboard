const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");
const Lead = require("../models/Lead");

router.get("/seed", async (req, res) => {
  try {
    await Lead.deleteMany({});
    const dummyLeads = Array.from({ length: 1000 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      stage: faker.helpers.arrayElement(["New", "Contacted", "Qualified", "Converted"]),
      createdAt: faker.date.past(),
    }));

    await Lead.insertMany(dummyLeads);

    res.send("Database seeded with 1000 leads!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error seeding database");
  }
});


router.get("/", async (req, res) => {
  try {
    let { search = "", stage, sort = "createdAt_desc", page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (stage) query.stage = stage;

    let [sortField, sortOrder] = sort.split("_"); 
    sortOrder = sortOrder === "asc" ? 1 : -1;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ leads, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

module.exports = router;
