const { pool } = require("../dbConfig")

exports.selectAllJabatan = async (req, res) => {
   try{
      const jabatan = await pool.query(
         "SELECT * from jabatan"
      )

      res.json(jabatan.rows)
   } catch(err){
      res.json({ message: err })
   }
}

exports.addJabatan = async (req, res) => {
    try{
       const { jabatan_tujuan } = req.body
 
       const jabatan = await pool.query(
          "INSERT INTO jabatan(jabatan_tujuan) VALUES($1) RETURNING *",
          [jabatan_tujuan]
       )
 
       res.json(jabatan)
    } catch(err) {
       console.error(err.message)
    }
 }

exports.updateJabatan = async (req, res) => {
    try{
        const { id_jabatan } = req.params
       const { jabatan_tujuan } = req.body
 
       const jabatan = await pool.query(
          "UPDATE jabatan SET jabatan_tujuan = $1 WHERE id_jabatan = $2",
          [jabatan_tujuan, id_jabatan]
       )
 
       res.json(jabatan)
    } catch(err) {
       console.error(err.message)
    }
 }
 
exports.deleteJabatan = async (req, res) => {
    try{
       const { id_jabatan } = req.params
 
       const jabatan = await pool.query(
          "DELETE FROM jabatan WHERE id_jabatan = $1", [
            id_jabatan
          ]
       )
 
       res.json("Jabatan is deleted")
    } catch (err) {
       res.json({ message: err })
    }
 }