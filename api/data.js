const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./../models/Data");
const router = express.Router();

router.post("/", async (req, res) => {
     let data = req.body;
     let useremail = data.useremail;
     const user = await User.findOne({ useremail });
     res.json(user.todoList);
});

router.post("/profile", async (req, res) => {
     let data = req.body;
     let useremail = data.useremail;
     const user = await User.findOne({ useremail });
     let reqData = {
          username: user.username,
          useremail: user.useremail,
          todoListCount: {
               activeTodo: user.todoList.activeTodo.length,
               completedStatus: user.todoList.completedStatus.length,
               notCompletedStatus: user.todoList.notCompletedStatus.length
          }
     };
     res.json(reqData);
});



router.put("/update", async (req, res) => {
     const { token, data } = req.body;
     try {
          await User.updateOne(
               { useremail: token.useremail },
               {
                    $set: {
                         "todoList.activeTodo": data.activeTodo,
                         "todoList.completedStatus": data.completedStatus,
                         "todoList.notCompletedStatus": data.notCompletedStatus
                    }
               }
          );
          res.json({ status: "ok", message: "Updated successfully" });
     } catch (err) {
          console.log(err);
          res.json({ status: "no", message: err.message });
     }
});

module.exports = router;
