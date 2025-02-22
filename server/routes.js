const express = require("express");
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");
const routes = express.Router();

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todo").collection("todos");
  return collection;
};

const getUsers = () => {
  const client = getConnectedClient();
  const collection = client.db("todo").collection("users");
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

routes.post("/users", async (req, res) => {
  const collection = getUsers();
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }
  // Check if a user with the same email already exists
  const existingUser = await collection.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Optionally, add logic for email validation or password hashing before saving

  const newUser = await collection.insertOne({ name, email, password });
  res.status(201).json({ name, email, _id: newUser.insertedId });
});

routes.post("/login", async (req, res) => {
  const collection = getUsers();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if the user exists
  const user = await collection.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the password matches
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Optionally, generate a JWT token (if you're using authentication tokens)
  // const token = generateJWT(user);

  res.status(200).json({
    message: "Login successful",
    user: { name: user.name, email: user.email, _id: user._id },
  });
});

module.exports = routes;
