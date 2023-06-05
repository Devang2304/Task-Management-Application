const Todo = require("../models/Todo");
const { validateObjectId } = require("../utils/validation");


exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.status(200).json({ todos, status: true, msg: "todos found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getTodo = async (req, res) => {
  try {
    if (!validateObjectId(req.params.todoId)) {
      return res.status(400).json({ status: false, msg: "todo id not valid" });
    }

    const todo = await Todo.findOne({ user: req.user.id, _id: req.params.todoId });
    if (!todo) {
      return res.status(400).json({ status: false, msg: "No todo found.." });
    }
    res.status(200).json({ todo, status: true, msg: "todo found successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postTodo = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of todo not found" });
    }
    const todo = await Todo.create({ user: req.user.id, description });
    res.status(200).json({ todo, status: true, msg: "todo created successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.putTodo = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ status: false, msg: "Description of todo not found" });
    }

    if (!validateObjectId(req.params.todoId)) {
      return res.status(400).json({ status: false, msg: "todo id not valid" });
    }

    let todo = await Todo.findById(req.params.todoId);
    if (!todo) {
      return res.status(400).json({ status: false, msg: "todo with given id not found" });
    }

    if (todo.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't update todo of another user" });
    }

    todo = await Todo.findByIdAndUpdate(req.params.todoId, { description }, { new: true });
    res.status(200).json({ todo, status: true, msg: "todo updated successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}


exports.deleteTodo = async (req, res) => {
  try {
    if (!validateObjectId(req.params.todoId)) {
      return res.status(400).json({ status: false, msg: "todo id not valid" });
    }

    let todo = await Todo.findById(req.params.todoId);
    if (!todo) {
      return res.status(400).json({ status: false, msg: "todo with given id not found" });
    }

    if (todo.user != req.user.id) {
      return res.status(403).json({ status: false, msg: "You can't delete todo of another user" });
    }

    await Todo.findByIdAndDelete(req.params.todoId);
    res.status(200).json({ status: true, msg: "todo deleted successfully.." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}