const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./../models/Data");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { useremail, password } = req.body;

  const user = await User.findOne({ useremail });
  if (!user) return res.json({ status: "no", message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ status: "no", message: "Wrong password" });
  res.json({
    status: "ok",
    token: {
      username: user.username,
      useremail: user.useremail
    }
  });
});

router.post("/reset", async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword, email } = req.body;

  try {
    const user = await User.findOne({ useremail: email });
    if (!user) {
      return res.json({ status: "no", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ status: "no", message: "Old password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.json({ status: "no", message: "New passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { useremail: email },
      { $set: { password: hashedPassword } }
    );

    return res.json({ status: "ok", message: "Password updated successfully" });

  } catch (err) {
    console.log(err);
    return res.json({ status: "no", message: "Server error" });
  }
});


router.post("/signup", async (req, res) => {
  const { username, useremail, password } = req.body;
  let userData = {
    username,
    useremail,
    password,
    todoList: {
      activeTodo: [],
      completedStatus: [],
      notCompletedStatus: []
    }
  };
  try {
    const data = await User.create({ ...userData });
    if (data) {
      res.json({ status: "ok", token: { username: data.username, useremail, password } });
    }
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: "no", message: "Email already registered" });
    } else {
      console.log(err);
      res.status(400).json({ status: "no", message: err.message });
    }
  }
});

module.exports = router;
