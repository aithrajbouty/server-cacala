const { pool } = require("../dbConfig")

exports.selectPostByAdmin = async (req, res) => {
   try{
      const post = await pool.query(
         "SELECT * from post WHERE id_admin = $1 ORDER BY waktu DESC", [
            req.user
         ]
      )

      res.json(post.rows)
   } catch(err){
      res.json({ message: err })
   }
}

exports.addPost = async (req, res) => {
   try{
      const { judul } = req.body
      const { teks } = req.body
      const { foto } = req.body
      const { video } = req.body

      const post = await pool.query(
         "INSERT INTO post(id_admin, judul, teks, foto, video) VALUES($1, $2, $3, $4, $5) RETURNING *",
         [req.user, judul, teks, foto, video]
      )

      res.json(post)
   } catch(err) {
      console.error(err.message)
   }
}

exports.updatePost = async (req, res) => {
   try{
      const { id_post } = req.params
      const { judul } = req.body
      const { teks } = req.body
      const { foto } = req.body
      const { video } = req.body

      const post = await pool.query(
         "UPDATE post SET judul = $1, teks = $2, foto = $3, video = $4 WHERE id_post = $5", [
            judul, teks, foto, video, id_post
         ]
      )

      res.json("Post is updated")
   } catch (err) {
      res.json({ message: err })
   }
}

exports.deletePost = async (req, res) => {
   try{
      const { id_post } = req.params

      const post = await pool.query(
         "DELETE FROM post WHERE id_post = $1", [
            id_post
         ]
      )

      res.json("Post is deleted")
   } catch (err) {
      res.json({ message: err })
   }
}

exports.selectPostByUser = async (req, res) => {
   const { id_admin } = req.params
   try{
      const post = await pool.query(
         "SELECT * from post WHERE id_admin = $1 ORDER BY waktu DESC", [
            id_admin
         ]
      )

      res.json(post.rows)
   } catch(err){
      res.json({ message: err })
   }
}
exports.selectPostById = async (req, res) => {
   const {id_post} = req.params
   try{
      const post = await pool.query(
         "select * from post where id_post = $1", [
         id_post
      ])

      res.json(post.rows)
   } catch(err) {
      res.json({ message: err })
   }
}