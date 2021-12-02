const express = require("express")
const router = express.Router()
const controller = require("../controllers/user_controller")
const authorization = require("../middleware/authorization")

router.get("/", authorization, controller.getUser)
router.put("/", authorization, controller.updateUser)
router.post("/:id_calon", authorization, controller.followCalon)
router.get("/followed", authorization, controller.selectFollowedCalonByUser)
router.delete("/unfollow/:id_calon", authorization, controller.unfollowCalon)
router.delete("/delete/:id_user", authorization, controller.deleteAkun)

module.exports = router
