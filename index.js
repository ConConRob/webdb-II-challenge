const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("./knexfile");

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db.select("*").from("zoos");
    res.status(200).json(zoos);
  } catch (error) {
    res.status(400).json(error);
  }
});

server.get("/api/zoos/:id", async (req, res) => {
  try {
    const zoo = await db
      .select("*")
      .from("zoos")
      .where("id", "=", req.params.id);
    if (zoo.length === 0) {
      res.status(404).json({ message: "that zoo does not exist" });
    } else {
      res.status(200).json(zoo);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post("/api/zoos", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Name is required to make a zoo" });
    } else {
      const idArray = await db("zoos").insert({ name });
      res.status(201).json({ id: idArray[0], name });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

server.put("/api/zoos/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Name is required to update a zoo" });
    } else {
      const numUpdated = await db("zoos")
        .where("id", "=", req.params.id)
        .update({ name });
      if (numUpdated === 0) {
        res.status(200).message({ message: "Failed to update zoo" });
      } else {
        res.status(201).json({ id: req.params.id, name });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
