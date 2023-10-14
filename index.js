const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

app.use(express.json());

let users = [];

let accessLog = fs.createWriteStream(path.join(__dirname, "log/access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLog }));

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/(:id)", (req, res) => {
  const userId = Number(req.params.id);
  const getUserById = users.find((user) => user.id === userId);
  if (!getUserById) {
    res.status(500).send("User ID not found");
  } else {
    res.status(200).json(getUserById);
  }
});

app.post("/users", (req, res) => {
  const user_info = req.body;
  users.push(user_info);
  res.status(201).json(user_info);
});

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const updatedUserById = users.find((user) => user.id === userId);
  const { name } = req.body;

  if (!updatedUserById) {
    res.status(500).send("User not found.");
  } else {
    updatedUserById.name = name;

    res.send(updatedUserById);
  }
});

app.delete("/users/:id", (req, res) => {
  const { userId } = req.params.id;
  const deleteUserById = users.findIndex((user) => user.id == userId);

  if (!deleteUserById) {
    res.status(500).send("User not found");
  } else {
    users.splice(deleteUserById, 1);
    res.status(200).send("User has been deleted successfully");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
