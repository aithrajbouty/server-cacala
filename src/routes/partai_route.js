const express = require("express")
const router = express.Router()
const controller = require("../controllers/partai_controller")

router.get("/", controller.selectAllPartai)
router.post("/", controller.addPartai)
router.put("/:id_partai", controller.updatePartai)
router.delete("/:id_partai", controller.deletePartai)
router.get("/calon/:id_calon", controller.selectPartaiCalon)
router.post("/calon", controller.addPartaiToCalon)

module.exports = router