const { pool } = require("../dbConfig")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const bcryptPassword = require("../utils/bcryptPassword")

exports.register = async (req, res) => {
   try{
      const { username, password } = req.body

      const admin = await pool.query("SELECT * FROM admins WHERE username = $1", [
         username
      ])

      if(admin.rows.length !== 0){
         return res.status(401).send("Admin already exists")
      }

      const bcryptPass = await bcryptPassword(password)

      const newAdmin = await pool.query("INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *",
         [username, bcryptPass]
      )

      res.json(newAdmin)
   } catch (err){
      console.error(err.message)
      res.status(500).send("Server Error")
   }
}

exports.login = async (req, res) => {
   try{
      const { username, password } = req.body

      const admin = await pool.query("SELECT * FROM admins WHERE username = $1", [
         username
      ])

      if(admin.rows.length === 0){
         return res.status(401).json("Password or username is incorrect")
      }

      const validPassword = await bcrypt.compare(
         password,
         admin.rows[0].password
      )

      if(!validPassword){
         return res.status(401).json("Password or username is incorrect")
      }

      const token = jwtGenerator(admin.rows[0].id_admin)

      res.json({ token })
   } catch (err){
      console.err(err.message)
      res.status(500).send("Server Error")
   }
}

exports.selectAllAdmins = async (req, res) => {
   try{
      const admins = await pool.query("SELECT * FROM admins")

      res.json(admins.rows)
   } catch (err){
      res.json({message: err})
   }
}

exports.getAdmin = async (req, res) => {
   try{
      const admin = await pool.query("SELECT * FROM admins WHERE id_admin = $1", [
         req.user
      ])
      res.json(admin.rows[0])
   }catch (err) {
      console.error(err.message)
      res.status(500).json("Server Error")
   }
}

exports.updateAdmin = async (req, res) => {
   try{
      const { id } = req.params
      const { username } = req.body
      const { password } = req.body

      const bcryptPass = await bcryptPassword(password)

      const admin = await pool.query("UPDATE admins SET username = $1, password = $2 WHERE id_admin = $3", [
         username, bcryptPass, id
      ])

      res.json("Admin detail is updated")
   } catch (err) {
      res.json({ message: err })
   }
}