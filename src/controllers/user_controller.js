const { pool } = require("../dbConfig")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const bcryptPassword = require("../utils/bcryptPassword")

exports.register = async (req, res) => {
   try{
      //1. destructure the req.body (name, email, password)
      const { username, email, password } = req.body

      //2. check if user exists (if user exist then throw error)
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
         email
      ])

      if(user.rows.length !== 0){
         return res.status(401).send("User already exists")
      }

      //3. Bcrypt the user password
      const bcryptPass = await bcryptPassword(password)

      //4. enter the new user inside our database
      const newUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
         [username, email, bcryptPass]
      )

      //5. generating our jwt token
      // const token = jwtGenerator(newUser.rows[0].id_user)

      res.json("User successfully registered")
   } catch (err){
      console.error(err.message)
      res.status(500).send("Server Error")
   }
}

exports.login = async (req, res) => {
   try{
      //1. destructure the req.body
      const { email, password } = req.body

      //2. check if user doesn't exist (if not,throw err)
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [
         email
      ])

      if(user.rows.length === 0){
         return res.status(401).json("Password or email is incorrect")
      }

      //3. check if incomming password is the same as the database password
      const validPassword = await bcrypt.compare(
         password,
         user.rows[0].password
      )

      if(!validPassword){
         return res.status(401).json("Password or email is incorrect")
      }

      //4. give them the jwt token
      const token = jwtGenerator(user.rows[0].id_user)

      res.json({ token })
   } catch (err){
      console.err(err.message)
      res.status(500).send("Server Error")
   }
}

exports.selectAllUsers = async (req, res) => {
   try{
      const users = await pool.query("SELECT * FROM users")

      res.json(users.rows)
   } catch (err){
      res.json({message: err})
   }
}

exports.getUser = async (req, res) => {
   try{
      const user = await pool.query("SELECT * FROM users WHERE id_user = $1", [
         req.user
      ])
      res.json(user.rows[0])
   }catch (err) {
      console.error(err.message)
      res.status(500).json("Server Error")
   }
}

exports.updateUser = async (req, res) => {
   try{
      //const { id } = req.params
      const { username } = req.body
      const { email } = req.body
      const { password } = req.body

      //bcrypt user password
      const bcryptPass = await bcryptPassword(password)

      const user = await pool.query("UPDATE users SET username = $1, email = $2, password = $3 WHERE id_user = $4", [
         username, email, bcryptPass, req.user
      ])

      res.json("User detail is updated")
   } catch (err) {
      res.json({ message: err })
   }
}

exports.followCalon = async (req, res) => {
   const { id_calon } = req.params
   try{
      const user = await pool.query(
         "INSERT INTO mengikuti_calon(id_user, id_calon) VALUES($1, $2);", [
            req.user, id_calon
         ]
      )

      res.json("Calon followed")
   } catch(err) {
      res.json({message: err})
   }
}

exports.selectFollowedCalonByUser = async (req, res) => {
   try{
      const calon = await pool.query(
         "select users.username, users.email, calon.*, jabatan.jabatan_tujuan, kota.kota FROM mengikuti_calon JOIN users ON users.id_user= mengikuti_calon.id_user JOIN calon ON mengikuti_calon.id_calon = calon.id_calon JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan JOIN kota on calon.id_dapil_kota = kota.id_kota WHERE mengikuti_calon.id_user = $1;",[
            req.user
         ])

         const length = Object.keys(calon.rows).length
         
         for(let i=0; i<length; i++){
            id_calon = calon.rows[i].id_calon
   
            partai = await pool.query(
               "select partai.nama_partai, partai.logo_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
                [calon.rows[i].id_calon]
            )
   
            j = 0
            calon.rows[i] = {...calon.rows[i], partai: partai.rows}
            calon.rows[i] = {...calon.rows[i], status: false}
         }
      
         res.json(calon.rows)
   } catch(err) {
      res.json({ message: err })
   }
}

exports.unfollowCalon = async (req, res) => {
   const { id_calon } = req.params
   try{
      const user = await pool.query(
         "DELETE FROM mengikuti_calon WHERE id_calon = $1 AND id_user = $2",
         [id_calon, req.user]
      )

      res.json("Calon unfollowed")
   } catch(err){
      res.json({message: err})
   }
}
exports.deleteAkun = async (req, res) => {
   const { id_user } = req.params
   try{
      const user = await pool.query(
         "DELETE FROM users WHERE id_user = $1",
         [id_user]
      )

      res.json("Account Deleted")
   } catch(err){
      res.json({message: err})
   }
}