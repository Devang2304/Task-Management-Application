const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});


const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;