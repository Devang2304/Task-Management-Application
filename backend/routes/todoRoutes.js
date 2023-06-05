const express = require("express");
const router = express.Router();
const { getTodos, getTodo, postTodo, putTodo, deleteTodo } = require("../controllers/todoControllers");
const { verifyAccessToken } = require("../middlewares.js/index.js");

// Routes beginning with /api/tasks
router.get("/", verifyAccessToken, getTodos);
router.get("/:todoId", verifyAccessToken, getTodo);
router.post("/", verifyAccessToken, postTodo);
router.put("/:todoId", verifyAccessToken, putTodo);
router.delete("/:todoId", verifyAccessToken, deleteTodo);

module.exports = router;
