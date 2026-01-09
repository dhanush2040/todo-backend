const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const todoItemSchema = new mongoose.Schema({
  id: Number,
  text: String
});

const todoListSchema = new mongoose.Schema({
  activeTodo: [todoItemSchema],
  completedStatus: [todoItemSchema],
  notCompletedStatus: [todoItemSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todoList: todoListSchema
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
