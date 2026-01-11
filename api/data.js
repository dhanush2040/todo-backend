const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./../models/Data");
const router = express.Router();

router.post("/", async (req, res) => {
     const { useremail } = req.body;
     if (!useremail) {
          return res.status(400).json({ message: "useremail is required" });
     }
     const user = await User.findOne({ useremail });
     if (!user) {
          return res.status(404).json({ message: "User not found" });
     }
     res.json(user.todoList || { activeTodo: [], completedStatus: [], notCompletedStatus: [] });
});

router.post("/profile", async (req, res) => {
     router.post("/profile", async (req, res) => {
          const { useremail } = req.body;
          if (!useremail) {
               return res.status(400).json({ message: "useremail is required" });
          }
          const user = await User.findOne({ useremail });
          if (!user) {
               return res.status(404).json({ message: "User not found" });
          }
          const todoList = user.todoList || {
               activeTodo: [],
               completedStatus: [],
               notCompletedStatus: []
          };
          res.json({
               username: user.username,
               useremail: user.useremail,
               todoListCount: {
                    activeTodo: todoList.activeTodo.length,
                    completedStatus: todoList.completedStatus.length,
                    notCompletedStatus: todoList.notCompletedStatus.length
               }
          });
     });
});

router.put("/update", async (req, res) => {
     const { token, data } = req.body;
     if (!token?.useremail) {
          return res.status(400).json({ message: "Invalid token" });
     }
     const result = await User.updateOne(
          { useremail: token.useremail },
          {
               $set: {
                    "todoList.activeTodo": data.activeTodo || [],
                    "todoList.completedStatus": data.completedStatus || [],
                    "todoList.notCompletedStatus": data.notCompletedStatus || []
               }
          }
     );
     if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
     }
     res.json({ status: "ok", message: "Updated successfully" });
});


module.exports = router;
