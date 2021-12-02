const bcrypt = require("bcrypt")

async function bcryptPassword(password){
   const saltRound = 10
   const salt = await bcrypt.genSalt(saltRound)

   return bcrypt.hash(password, salt)
}

module.exports = bcryptPassword