const { pool } = require("../dbConfig")

exports.selectAllPartai = async (req, res) => {
   try{
      const partai = await pool.query(
         "SELECT * from partai"
      )

      res.json(partai.rows)
   } catch(err){
      res.json({ message: err })
   }
}

exports.addPartai = async (req, res) => {
    try{
       const { nama_partai } = req.body
       const { logo_partai } = req.body
 
       const partai = await pool.query(
          "INSERT INTO partai(nama_partai, logo_partai) VALUES($1, $2) RETURNING *",
          [nama_partai, logo_partai]
       )
 
       res.json(partai)
    } catch(err) {
       console.error(err.message)
    }
 }

exports.updatePartai = async (req, res) => {
    try{
        const { id_partai } = req.params
       const { nama_partai } = req.body
       const { logo_partai } = req.body
 
       const partai = await pool.query(
          "UPDATE partai SET nama_partai = $1, logo_partai = $2 WHERE id_partai = $3",
          [nama_partai, logo_partai, id_partai]
       )
 
       res.json(partai)
    } catch(err) {
       console.error(err.message)
    }
 }
 
exports.deletePartai = async (req, res) => {
    try{
       const { id_partai } = req.params
 
       const partai = await pool.query(
          "DELETE FROM partai WHERE id_partai = $1", [
            id_partai
          ]
       )
 
       res.json("Partai is deleted")
    } catch (err) {
       res.json({ message: err })
    }
 }

 exports.selectPartaiCalon = async (req, res) => {
    try{
        const { id_calon } = req.params 

       const partai = await pool.query(
          "select partai.nama_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
          [id_calon]
       )
 
       res.json(partai.rows)
    } catch(err){
       res.json({ message: err })
    }
 }

 exports.addPartaiToCalon = async (req, res) => {
     try{
        const { id_calon } = req.body
        const { id_partai } = req.body
  
        const partai = await pool.query(
           "INSERT INTO partai_calon(id_calon, id_partai) VALUES($1, $2) RETURNING *",
           [id_calon, id_partai]
        )
  
        res.json(partai)
     } catch(err) {
        console.error(err.message)
     }
  }