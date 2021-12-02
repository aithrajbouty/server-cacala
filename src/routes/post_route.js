const express = require("express")
const router = express.Router()
const controller = require("../controllers/post_controller")
const authorization = require("../middleware/authorization")

router.post("/", authorization,  controller.addPost)
router.get("/", authorization,  controller.selectPostByAdmin)
router.get("/:id_post", controller.selectPostById)
router.put("/:id_post", controller.updatePost)
router.delete("/:id_post", controller.deletePost)

router.get("/user/:id_admin", controller.selectPostByUser)

module.exports = router