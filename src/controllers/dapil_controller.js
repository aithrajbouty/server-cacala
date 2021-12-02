const { pool } = require("../dbConfig")

exports.selectAllProvinsi = async (req, res) => {
   try{
      const provinsi = await pool.query(
         "SELECT * from provinsi ORDER BY provinsi"
      )

      res.json(provinsi.rows)
   } catch(err){
      res.json({ message: err })
   }
}

exports.addProvinsi = async (req, res) => {
	try{
		const { provinsi } = req.body

		const add_provinsi = await pool.query(
			"INSERT INTO provinsi(provinsi) VALUES($1) RETURNING *",
			[provinsi]
		)

		res.json(add_provinsi)
	} catch(err) {
		console.error(err.message)
	}
 }

exports.updateProvinsi = async (req, res) => {
	try{
		const { id_provinsi } = req.params
		const { provinsi } = req.body

		const update_provinsi = await pool.query(
			"UPDATE provinsi SET provinsi = $1 WHERE id_provinsi = $2",
			[provinsi, id_provinsi]
		)

		res.json(update_provinsi)
	} catch(err) {
		console.error(err.message)
	}
}

exports.deleteProvinsi = async (req, res) => {
	try{
		const { id_provinsi } = req.params

		const provinsi = await pool.query(
			"DELETE FROM provinsi WHERE id_provinsi = $1", [
					id_provinsi
			]
		)

		res.json("Provinsi is deleted")
	} catch (err) {
		res.json({ message: err })
	}
}

exports.selectProvinsiById = async (req, res) => {
	try{
		const {id_provinsi} = req.params

		const provinsi = await pool.query(
			"SELECT * from provinsi WHERE id_provinsi = $1",
			[id_provinsi]
		)

		res.json(provinsi.rows[0])
	} catch(err){
		res.json({ message: err })
	}
}

exports.selectAllKota = async (req, res) => {
	try{
		const kota = await pool.query(
			"SELECT * from kota, provinsi where kota.id_provinsi = provinsi.id_provinsi ORDER BY kota"
		)

		res.json(kota.rows)
	} catch(err){
		res.json({ message: err })
	}
}

 exports.addKota = async (req, res) => {
	try{
		const { id_provinsi } = req.body
		const { kota } = req.body

		const add_kota = await pool.query(
			"INSERT INTO kota(id_provinsi, kota) VALUES($1, $2) RETURNING *",
			[id_provinsi, kota]
		)

		res.json(add_kota)
	} catch(err) {
		console.error(err.message)
	}
}

exports.updateKota = async (req, res) => {
	try{
		const { id_kota } = req.params
		const { id_provinsi } = req.body
		const { kota } = req.body

		const update_kota = await pool.query(
			"UPDATE kota SET id_provinsi = $1, kota = $2 WHERE id_kota = $3",
			[id_provinsi, kota, id_kota]
		)

		res.json(update_kota)
	} catch(err) {
		console.error(err.message)
	}
}

exports.deleteKota = async (req, res) => {
	try{
		const { id_kota } = req.params

		const kota = await pool.query(
			"DELETE FROM kota WHERE id_kota = $1", [
				id_kota
			]
		)

		res.json("Kota is deleted")
	} catch (err) {
		res.json({ message: err })
	}
}

exports.selectKotaById = async (req, res) => {
	try{
		const {id_kota} = req.params

		const kota = await pool.query(
			"SELECT * from kota WHERE id_kota = $1",
			[id_kota]
		)

		res.json(kota.rows[0])
	} catch(err){
		res.json({ message: err })
	}
}

exports.selectKotaByIdProvinsi = async (req, res) => {
	try{
		const {id_provinsi} = req.params

		const kota = await pool.query(
			"SELECT * from kota WHERE id_provinsi = $1",
			[id_provinsi]
		)

		res.json(kota.rows)
	} catch(err){
		res.json({ message: err })
	}
}