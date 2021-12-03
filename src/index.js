const express = require("express");
const app = express()
const cors = require("cors")
const { pool } = require("./dbConfig")
const bodyParser = require("body-parser")
require("dotenv/config")

app.use(express.json()) //req.body
app.use(cors())
app.use(bodyParser.json())

//ROUTES//
const authRoute = require("../src/routes/auth_route")
const userRoute = require("../src/routes/user_route")
const adminRoute = require("../src/routes/admin_route")
const calonRoute = require("../src/routes/calon_route")
const postRoute = require("../src/routes/post_route")
const jabatanRoute = require("../src/routes/jabatan_route")
const dapilRoute = require("../src/routes/dapil_route")
const partaiRoute = require("../src/routes/partai_route")

app.use("/auth", authRoute)
app.use("/user", userRoute)
app.use("/admin", adminRoute)
app.use("/calon", calonRoute)
app.use("/post", postRoute)
app.use("/jabatan", jabatanRoute)
app.use("/dapil", dapilRoute)
app.use("/partai", partaiRoute)

app.get('*', function(req,res) {
   res.sendFile(path.join(__dirname, '/buil.index.html'), function(err){
      if (err){
         res.status(500).send(__dirname)
      }
   })
})

app.listen(process.env.PORT || 3000, () => {
   console.log("server is running on port 3000")
})