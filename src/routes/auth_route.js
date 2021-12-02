const express = require("express")
const router = express.Router()
const validInfo = require("../middleware/validInfo")
const userCont = require("../controllers/user_controller")
const adminCont = require("../controllers/admin_controller")

router.get("/users/", userCont.selectAllUsers)
router.post("/users/register", validInfo, userCont.register)
router.post("/users/login", validInfo, userCont.login)

router.post("/admins/login", adminCont.login)
router.post("/admins/register", adminCont.register)
router.get("/admins/", adminCont.selectAllAdmins)

module.exports = router