const express = require("express")
const { registerPage, registerUser, userList, deleteUser, loginPage, loginUser, updateUser, verifyUser, getAllUsers } = require("../controllers/User.controller")
const router = express.Router()

router.get("/register", registerPage)
router.post("/delete/:id", verifyUser, deleteUser)
router.get("users", verifyUser, getAllUsers)
router.post("/register", registerUser)
router.get("/userList", userList)
router.get("/login", loginPage)
router.post("/login", verifyUser, loginUser)
router.patch("/update/:id",verifyUser, updateUser)

module.exports = router 