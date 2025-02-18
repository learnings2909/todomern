const express = require("express");
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");
const routes = express.Router();

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todo").collection("todos");
  return collection;
};

//get TODOs

routes.get("/todos", async (req, res) => {
  const collection = getCollection();
  const todos = await collection.find({}).toArray();
  res.status(200).json(todos);
});

routes.post("/todos", async (req, res) => {
  const collection = getCollection();
  let { todo } = req.body;
  if (!todo) {
    return res.status(400).json({ message: "todo is required" });
  }
  todo = typeof todo === "string" ? todo : JSON.stringify(todo);
  const newTodo = await collection.insertOne({ todo, status: false });
  res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

//delete TODOs
routes.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const deletedTodo = await collection.deleteOne({ _id });
  res.status(200).json(deletedTodo);
});

//update TODOs
routes.put("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;
  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "InvalidStatus" });
  }
  const updateTodo = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );
  res.status(200).json(updateTodo);
});

module.exports = routes;
