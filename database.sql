-- TABEL USER
CREATE DATABASE db_cacala;

CREATE TABLE users(
   id uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   username VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL
);

INSERT INTO users(username, email, password) VALUES ('boti', 'boti@cat.com', 'botiboti');

--TABEL KOTA
CREATE TABLE Kota(
   id_kota uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   id_provinsi uuid NOT NULL,
   kota VARCHAR(50) NOT NULL,
   CONSTRAINT fk_provinsi
      FOREIGN KEY(id_provinsi) 
	      REFERENCES provinsi(id_provinsi)
);

--add kota
INSERT INTO Kota(id_provinsi, kota) VALUES(
   '9f709293-5ddd-4e12-a56f-894e0962f472',
   'Kota Gorontalo'
);

--add provinsi
INSERT INTO provinsi(provinsi) VALUES ('Gorontalo');

-- select kota + provinsi
select kota.id_kota, kota.kota, provinsi.provinsi
   FROM kota, provinsi
         WHERE kota.id_provinsi = provinsi.id_provinsi;

--TABEL CALON
CREATE TABLE Calon(
   id_calon uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   id_admin uuid REFERENCES admins(id_admin),
   id_jabatan uuid REFERENCES jabatan(id_jabatan),
   id_dapil_kota uuid REFERENCES kota(id_kota),
   nama VARCHAR(255) NOT NULL,
   foto TEXT,
   slogan VARCHAR(255)
);

INSERT INTO Calon(
      id_admin, 
      id_jabatan,
      id_dapil_kota,
      nama,
      foto,
      slogan
   ) 
   VALUES(
      '7f5135e1-afb6-421c-9b29-11dea6c0b729', 
      '7ab14b00-559b-4a3a-b307-80a78cff4b22',
      '2b4af532-dfe7-4aef-8734-aeec7611e30b',
      'WAPRES',
      'https://i.pinimg.com/474x/40/f3/1d/40f31dd88a4ec213f8b21d1444242969.jpg',
      'Aku calon wakil presiden'
   );

select c.id_calon, c.nama, c.foto, c.slogan, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi, pend.nama_institusi, pend.detail_pendidikan, pend.tahun_mulai_pendidikan, pend.tahun_selesai_pendidikan, pek.nama_pekerjaan, pek.detail_pekerjaan, pek.tahun_mulai_pekerjaan, pek.tahun_selesai_pekerjaan
   FROM calon c
      JOIN admins a on c.id_admin = a.id_admin
      JOIN jabatan j on c.id_jabatan = j.id_jabatan
      JOIN kota k on c.id_dapil_kota = k.id_kota
      JOIN provinsi p on k.id_provinsi = p.id_provinsi
      JOIN riwayat_pendidikan pend on pend.id_calon = c.id_calon
      JOIN riwayat_pekerjaan pek on pek.id_calon = c.id_calon
;

SELECT c.id_calon, c.nama, c.foto, c.slogan, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi 
   FROM calon c
      JOIN admins a on c.id_admin = a.id_admin 
      JOIN jabatan j on c.id_jabatan = j.id_jabatan 
      JOIN kota k on c.id_dapil_kota = k.id_kota 
      JOIN provinsi p on k.id_provinsi = p.id_provinsi 
   WHERE 
      c.id_jabatan = '1267363f-491f-4b70-aecc-3ef02b4c32ee' 
   AND 
      c.id_dapil_kota = '04c68139-0968-40ba-acdc-85ed4ef98ea8'
;

SELECT c.id_calon, c.nama, c.foto, c.slogan, a.id_admin, j.jabatan_tujuan, k.kota, p.provinsi FROM calon c JOIN admins a on c.id_admin = a.id_admin JOIN jabatan j on c.id_jabatan = j.id_jabatan JOIN kota k on c.id_dapil_kota = k.id_kota JOIN provinsi p on k.id_provinsi = p.id_provinsi WHERE c.id_jabatan = '1267363f-491f-4b70-aecc-3ef02b4c32ee' AND c.id_dapil_kota = '04c68139-0968-40ba-acdc-85ed4ef98ea8';

select * 
   from calon c
      join admins a on c.id_admin = a.id_admin
      join jabatan j on c.id_jabatan = j.id_jabatan
   where c.id_jabatan = '4afc1348-c4a3-4c3c-a355-dcd938614b13' AND j.id_jabatan = '7ab14b00-559b-4a3a-b307-80a78cff4b22'
;

--TABEL PARTAI
CREATE TABLE partai(
   id_partai uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   nama_partai VARCHAR(100) NOT NULL
);

INSERT INTO partai (nama_partai) VALUES ('Partai Mantap');

--TABEL POST
CREATE TABLE post(
   id_post uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   id_admin uuid REFERENCES admins(id_admin),
   judul VARCHAR(100),
   teks TEXT,
   foto TEXT,
   video TEXT,
   waktu TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO post(
      id_admin, 
      judul,
      teks,
      foto,
      video
   ) 
   VALUES(
      '6bf8043e-1015-435a-89e0-a753427ba45a', 
      'JUDUL POST 2',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      '',
      ''
   );

--TABEL RIWAYAT PENDIDIKAN
CREATE TABLE riwayat_pendidikan(
   id_pendidikan uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   id_calon uuid REFERENCES calon(id_calon),
   nama_institusi VARCHAR(255) NOT NULL,
   detail_pendidikan TEXT,
   tahun_mulai_pendidikan VARCHAR(4),
   tahun_selesai_pendidikan VARCHAR(4)
);

INSERT INTO riwayat_pendidikan(
      id_calon, 
      nama_institusi,
      detail_pendidikan,
      tahun_mulai_pendidikan,
      tahun_selesai_pendidikan
   ) 
   VALUES(
      '32555aee-f2a8-4cf3-924f-cfe888d659ae', 
      'Universitas Padjadjaran',
      'FMIPA Teknik Informatika',
      '2018',
      '2022'
   );

INSERT INTO riwayat_pendidikan(id_calon, nama_institusi, detail, tahun_mulai, tahun_selesai) VALUES($1, $2, $3, $4, $5);

--TABEL RIWAYAT PEKERJAAN
CREATE TABLE riwayat_pekerjaan(
   id_pekerjaan uuid PRIMARY KEY DEFAULT
   uuid_generate_v4(),
   id_calon uuid REFERENCES calon(id_calon),
   nama_pekerjaan VARCHAR(255) NOT NULL,
   detail_pekerjaan TEXT,
   tahun_mulai_pekerjaan VARCHAR(4),
   tahun_selesai_pekerjaan VARCHAR(4)
);

INSERT INTO riwayat_pekerjaan(
      id_calon, 
      nama_pekerjaan,
      detail_pekerjaan,
      tahun_mulai_pekerjaan,
      tahun_selesai_pekerjaan
   ) 
   VALUES(
      '5e1788f2-9912-417b-abd5-78b67b358cf5', 
      'Programmer',
      'Programmer handal',
      '2020',
      '2020'
   );

--TABEL PARTAI_CALON
CREATE TABLE partai_calon (
  id_calon uuid REFERENCES calon (id_calon) ON UPDATE CASCADE ON DELETE CASCADE,
  id_partai uuid REFERENCES partai (id_partai) ON UPDATE CASCADE,
  CONSTRAINT partai_calon_pkey PRIMARY KEY (id_calon, id_partai)  -- explicit pk
);

INSERT INTO partai_calon(
      id_calon, 
      id_partai
   ) 
   VALUES(
      '32555aee-f2a8-4cf3-924f-cfe888d659ae', 
      'e41f08af-27c4-4016-8766-ca45ed26edff'
   );

select calon.nama, partai.nama_partai
   FROM partai_calon 
      JOIN calon ON partai_calon.id_calon = calon.id_calon
      JOIN partai ON partai_calon.id_partai = partai.id_partai
   WHERE partai_calon.id_calon = '32555aee-f2a8-4cf3-924f-cfe888d659ae';

select calon.nama, partai.nama_partai FROM partai_calon JOIN calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai;

SELECT calon.id_calon, calon.nama, calon.foto, calon.slogan, admins.username, jabatan.jabatan_tujuan, kota.kota, provinsi.provinsi, partai.nama_partai
   FROM calon 
      JOIN admins on calon.id_admin = admins.id_admin 
      JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan 
      JOIN kota on calon.id_dapil_kota = kota.id_kota 
      JOIN provinsi on kota.id_provinsi = provinsi.id_provinsi 
      JOIN partai_calon ON partai_calon.id_calon = calon.id_calon
      JOIN partai ON partai_calon.id_partai = partai.id_partai
   WHERE partai_calon.id_partai = '75f09646-c4c1-46ac-9261-11f468aabdb4';

SELECT calon.id_calon, calon.nama, calon.foto, calon.slogan, admins.username, jabatan.jabatan_tujuan, kota.kota, provinsi.provinsi, partai.nama_partai FROM calon JOIN admins on calon.id_admin = admins.id_admin JOIN jabatan on calon.id_jabatan = jabatan.id_jabatan JOIN kota on calon.id_dapil_kota = kota.id_kota JOIN provinsi on kota.id_provinsi = provinsi.id_provinsi JOIN partai_calon ON partai_calon.id_calon = calon.id_calon JOIN partai ON partai_calon.id_partai = partai.id_partai WHERE partai_calon.id_partai = '75f09646-c4c1-46ac-9261-11f468aabdb4';

--TABEL MENGIKUTI_CALON
CREATE TABLE mengikuti_calon (
  id_user uuid REFERENCES users (id_user) ON UPDATE CASCADE ON DELETE CASCADE,
  id_calon uuid REFERENCES calon (id_calon) ON UPDATE CASCADE,
  CONSTRAINT mengikuti_calon_pkey PRIMARY KEY (id_user, id_calon)  -- explicit pk
);

INSERT INTO mengikuti_calon(
      id_user,
      id_calon
   ) 
   VALUES(
      '862c6d34-c90c-40ff-8015-789044dd1697', 
      '32555aee-f2a8-4cf3-924f-cfe888d659ae'
   );

INSERT INTO mengikuti_calon(id_user, id_calon) VALUES('862c6d34-c90c-40ff-8015-789044dd1697','32555aee-f2a8-4cf3-924f-cfe888d659ae');

select users.username, users.email, calon.id_calon, calon.nama
   FROM mengikuti_calon 
      JOIN users ON users.id_user= mengikuti_calon.id_user
      JOIN calon ON mengikuti_calon.id_calon = calon.id_calon
   WHERE mengikuti_calon.id_user = '862c6d34-c90c-40ff-8015-789044dd1697';

select users.username, users.email, calon.id_calon, calon.nama FROM mengikuti_calon JOIN users ON users.id_user= mengikuti_calon.id_user JOIN calon ON mengikuti_calon.id_calon = calon.id_calon WHERE mengikuti_calon.id_user = $1;

delete from mengikuti_calon where id_calon = 'e32568fd-7296-4935-b297-b6ce9f1a82e6' AND id_user = '862c6d34-c90c-40ff-8015-789044dd1697';

--TABEL JABATAN
INSERT INTO jabatan(jabatan_tujuan) VALUES ('Wakil Presiden');

