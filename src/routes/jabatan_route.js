const express = require("express")
const router = express.Router()
const controller = require("../controllers/jabatan_controller")

router.get("/", controller.selectAllJabatan)
router.post("/", controller.addJabatan)
router.put("/:id_jabatan", controller.updateJabatan)
router.delete("/:id_jabatan", controller.deleteJabatan)

module.exports = router