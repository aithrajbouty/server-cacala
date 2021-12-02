const { pool } = require("../dbConfig")

exports.selectAllCalon = async (req, res) => {
   try{
      const calon = await pool.query(
         "select c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi;"
      )

      const length = Object.keys(calon.rows).length
      
      for(let i=0; i<length; i++){
         id_calon = calon.rows[i].id_calon

         partai = await pool.query(
            "select partai.* FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
             [calon.rows[i].id_calon]
         )

         pendidikan = await pool.query(
            "select pen.* FROM riwayat_pendidikan pen JOIN calon c ON pen.id_calon = c.id_calon WHERE pen.id_calon = $1",
            [id_calon]
         )

         pekerjaan = await pool.query(
            "select pek.* FROM riwayat_pekerjaan pek JOIN calon c ON pek.id_calon = c.id_calon WHERE pek.id_calon = $1",
            [id_calon]
         )

         calon.rows[i] = {...calon.rows[i], partai: partai.rows, riwayat_pendidikan: pendidikan.rows, riwayat_pekerjaan: pekerjaan.rows}
      }

      res.json(calon.rows)
   } catch(err) {
      console.error(err.message)
   }
}

exports.addCalon = async (req, res) => {
   try{
      const { id_admin } = req.body
      const { id_jabatan } = req.body
      const { id_dapil_kota } = req.body
      const { nama } = req.body
      const { foto } = req.body
      const { slogan } = req.body
      const { no_urut } = req.body

      const calon = await pool.query(
         "INSERT INTO Calon(id_admin, id_jabatan, id_dapil_kota, nama, foto, slogan, no_urut) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id_admin, id_jabatan, id_dapil_kota, nama, foto, slogan, no_urut])

      res.json(calon)
   } catch (err){
      console.error(err.message)
   }
}

exports.updateCalon = async (req, res) => {
   try{
      const { id_calon } = req.params
      const { id_admin } = req.body
      const { id_jabatan } = req.body
      const { id_dapil_kota } = req.body
      const { nama } = req.body
      const { foto } = req.body
      const { slogan } = req.body
      const { no_urut } = req.body

      const update_calon = await pool.query(
         "UPDATE calon SET id_admin = $1, id_jabatan = $2, id_dapil_kota =$3, nama = $4, foto = $5, slogan = $6, no_urut = $7 WHERE id_calon = $8",
         [id_admin, id_jabatan, id_dapil_kota, nama, foto, slogan, no_urut, id_calon]
      )

      res.json(update_calon)
   } catch(err){
      console.error(err.message)
   }
}

exports.deleteCalon = async (req, res) => {
   try{
      const { id_calon } = req.params

      const calon = await pool.query(
         "DELETE FROM calon WHERE id_calon = $1",
         [id_calon]
      )

      res.json("Calon is deleted")
   } catch(err){
      res.json({ message: err })
   }
}

exports.selectCalonByIdCalon = async (req, res) => {
   const {id_calon} = req.params
   try{
      let calon = await pool.query(
         "select c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi, pend.nama_institusi, pend.detail_pendidikan, pend.tahun_mulai_pendidikan, pend.tahun_selesai_pendidikan, pek.nama_pekerjaan, pek.detail_pekerjaan, pek.tahun_mulai_pekerjaan, pek.tahun_selesai_pekerjaan FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi JOIN riwayat_pendidikan pend on pend.id_calon = c.id_calon JOIN riwayat_pekerjaan pek on pek.id_calon = c.id_calon WHERE c.id_calon = $1;", [
            id_calon
      ])

      const length = Object.keys(calon).length
      
      for(let i=0; i<length; i++){
         partai = await pool.query(
            "select partai.nama_partai, partai.logo_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
             [calon.rows[0].id_calon]
         )

         calon.rows[i] = {...calon.rows[i], partai: partai.rows}
      }

      res.json(calon.rows[0])
   } catch(err) {
      console.error(err.message)
   }
}

exports.selectCalonByIdCalonForDev = async (req, res) => {
   const {id_calon} = req.params
   try{
      const calon = await pool.query(
         "select * from calon WHERE id_calon = $1;", [
            id_calon
      ])

      res.json(calon.rows[0])
   } catch(err) {
      res.json({ message: err })
   }
}

exports.selectCalonByUser = async (req, res) => {
   const {id_admin} = req.params
   try{
      const calon = await pool.query(
         "select c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a ON c.id_admin = a.id_admin JOIN jabatan j ON c.id_jabatan = j.id_jabatan JOIN kota k ON c.id_dapil_kota = k.id_kota JOIN provinsi p ON k.id_provinsi = p.id_provinsi WHERE c.id_admin = $1", [
         id_admin
      ])

      const length = Object.keys(calon.rows).length
      
      for(let i=0; i<length; i++){
         // id_calon = calon.rows[i].id_calon

         partai = await pool.query(
            "select partai.nama_partai, partai.logo_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
             [calon.rows[i].id_calon]
         )

         pendidikan = await pool.query(
            "select pen.* FROM riwayat_pendidikan pen JOIN calon c ON pen.id_calon = c.id_calon WHERE pen.id_calon = $1",
            [calon.rows[i].id_calon]
         )

         pekerjaan = await pool.query(
            "select pek.* FROM riwayat_pekerjaan pek JOIN calon c ON pek.id_calon = c.id_calon WHERE pek.id_calon = $1",
            [calon.rows[i].id_calon]
         )

         calon.rows[i] = {...calon.rows[i], partai: partai.rows, riwayat_pendidikan: pendidikan.rows, riwayat_pekerjaan: pekerjaan.rows}
      }

      res.json(calon.rows)
   } catch(err) {
      res.json({ message: err })
   }
}

exports.selectCalonByKota = async (req, res) => {
   const { id_kota } = req.params
   try{
      const calon = await pool.query(
         "SELECT calon.id_calon, calon.nama, calon.foto, calon.slogan, calon.no_urut, admins.id_admin, jabatan.jabatan_tujuan, kota.kota, provinsi.provinsi FROM calon JOIN admins on calon.id_admin = admins.id_admin JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan JOIN kota on calon.id_dapil_kota = kota.id_kota JOIN provinsi on kota.id_provinsi = provinsi.id_provinsi WHERE kota.id_kota = $1;",[
            id_kota
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

exports.selectCalonByJabatan = async (req, res) => {
   const { id_jabatan } = req.params
   try{
      const calon = await pool.query(
         "SELECT calon.id_calon, calon.nama, calon.foto, calon.slogan, calon.no_urut, admins.id_admin, jabatan.jabatan_tujuan, kota.kota, provinsi.provinsi FROM calon JOIN admins on calon.id_admin = admins.id_admin JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan JOIN kota on calon.id_dapil_kota = kota.id_kota JOIN provinsi on kota.id_provinsi = provinsi.id_provinsi WHERE calon.id_jabatan = $1 ORDER BY no_urut;",[
            id_jabatan
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

exports.selectCalonByPartai = async (req, res) => {
   const { id_partai } = req.params
   try{
      const calon = await pool.query(
         "SELECT calon.id_calon, calon.nama, calon.foto, calon.slogan, calon.no_urut, admins.id_admin, jabatan.jabatan_tujuan, kota.kota, provinsi.provinsi, partai.nama_partai FROM calon JOIN admins on calon.id_admin = admins.id_admin JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan JOIN kota on calon.id_dapil_kota = kota.id_kota JOIN provinsi on kota.id_provinsi = provinsi.id_provinsi JOIN partai_calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_partai = $1;",[
            id_partai
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

exports.selectPartai = async (req, res) => {
   try{
      const calon = await pool.query(
         "select calon.nama, partai.nama_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai;"
      )

      res.json(calon.rows)
   } catch(err) {
      res.json({ message: err })
   }
}

exports.addRiwayatPendidikanCalon = async (req, res) => {
   try{
      const { id_calon } = req.body
      const { nama_institusi } = req.body
      const { detail } = req.body
      const { tahun_mulai } = req.body
      const { tahun_selesai } = req.body

      const calon = await pool.query(
         "INSERT INTO riwayat_pendidikan(id_calon, nama_institusi, detail_pendidikan, tahun_mulai_pendidikan , tahun_selesai_pendidikan) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [id_calon, nama_institusi, detail, tahun_mulai, tahun_selesai])

      res.json(calon)
   } catch (err){
      console.error(err.message)
   }
}

exports.addRiwayatPekerjaanCalon = async (req, res) => {
   try{
      const { id_calon } = req.body
      const { nama_pekerjaan } = req.body
      const { detail } = req.body
      const { tahun_mulai } = req.body
      const { tahun_selesai } = req.body

      const calon = await pool.query(
         "INSERT INTO riwayat_pekerjaan(id_calon, nama_pekerjaan, detail_pekerjaan, tahun_mulai_pekerjaan, tahun_selesai_pekerjaan) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [id_calon, nama_pekerjaan, detail, tahun_mulai, tahun_selesai])

      res.json(calon)
   } catch (err){
      console.error(err.message)
   }
}

exports.selectCalonByAdmin = async (req, res) => {
   try{
      const calon = await pool.query(
         'select c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM admins a JOIN calon c on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi  WHERE a.id_admin = $1;', [
         req.user
      ])

      const length = Object.keys(calon.rows).length
      
      for(let i=0; i<length; i++){
         id_calon = calon.rows[i].id_calon

         partai = await pool.query(
            "select partai.* FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
             [calon.rows[i].id_calon]
         )

         pendidikan = await pool.query(
            "select pen.* FROM riwayat_pendidikan pen JOIN calon c ON pen.id_calon = c.id_calon WHERE pen.id_calon = $1",
            [id_calon]
         )

         pekerjaan = await pool.query(
            "select pek.* FROM riwayat_pekerjaan pek JOIN calon c ON pek.id_calon = c.id_calon WHERE pek.id_calon = $1",
            [id_calon]
         )

         calon.rows[i] = {...calon.rows[i], partai: partai.rows, riwayat_pendidikan: pendidikan.rows, riwayat_pekerjaan: pekerjaan.rows}
      }

      res.json(calon.rows[0])
   } catch(err) {
      res.json({ message: err })
   }
}

exports.selectCalonDPRDKotaByKota = async (req, res) => {
   const { id_kota } = req.params
   try{
      const calon = await pool.query(
         "SELECT c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = '1267363f-491f-4b70-aecc-3ef02b4c32ee' AND c.id_dapil_kota = $1 ORDER BY no_urut;",[
            id_kota
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

exports.selectCalonDPRDProvByProv = async (req, res) => {
   const { id_provinsi } = req.params
   try{
      const calon = await pool.query(
         "SELECT c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = 'aa0faabb-82e5-45bc-8b0a-c5795aa4c91a' AND k.id_provinsi = $1 ORDER BY no_urut;",[
            id_provinsi
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

exports.selectCalonDPRDProvByKota = async (req, res) => {
   const { id_kota } = req.params
   try{
      const calon = await pool.query(
         "SELECT c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = 'aa0faabb-82e5-45bc-8b0a-c5795aa4c91a' AND c.id_dapil_kota = $1 ORDER BY no_urut;",[
            id_kota
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

exports.selectCalonDPRRIByProv = async (req, res) => {
   const { id_provinsi } = req.params
   try{
      const calon = await pool.query(
         "SELECT c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = 'ab55ff16-0673-4c8b-a572-bf282f75d9cf' AND k.id_provinsi = $1 ORDER BY no_urut;",[
            id_provinsi
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

exports.selectCalonDPDByProv = async (req, res) => {
   const { id_provinsi } = req.params
   try{
      const calon = await pool.query(
         "SELECT c.id_calon, c.nama, c.foto, c.slogan, c.no_urut, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = '51978294-1f8a-4c8c-acbf-f3cc013c16d3' AND k.id_provinsi = $1 ORDER BY no_urut",[
            id_provinsi
         ])

         const length = Object.keys(calon.rows).length
         
         for(let i=0; i<length; i++){
            id_calon = calon.rows[i].id_calon
   
            partai = await pool.query(
               "select partai.nama_partai, partai.logo_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_calon = $1;",
                [calon.rows[i].id_calon]
            )
   
            calon.rows[i] = {...calon.rows[i], partai: partai.rows}
            calon.rows[i] = {...calon.rows[i], status: false}
         }
      
         res.json(calon.rows)
   } catch(err) {
      res.json({ message: err })
   }
}