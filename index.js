const auth = require('./app/middleware/auth');
const express = require('express')
const bodyParser = require('body-parser')
const PelangganController = require('./app/controllers/PelangganController')
const TagihanController = require('./app/controllers/TagihanController')
const LoginController = require('./app/controllers/LoginController');
const UserController = require('./app/controllers/UserController');
const StatController = require('./app/controllers/StatController');
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post("/login", async (req, res) => {
  var loginController = new LoginController();
  var result = await loginController.login(req);
  if(result == null){
    res.status(401).send({ message: "Username atau password salah"});
  } else {
    res.send({message:"berhasil login",data:result});
  }
});

app.post("/check-login", async (req, res) => {
  const user = await auth.verifyToken(req);
  if(user == null){
    res.status(401).send({ message: "Token tidak valid" });
  }
  res.send({message:"berhasil login",data:user});
});

app.post('/user', async (req, res) => {
  var userController = new UserController();
  await userController.create(req).then(function (user) {
    res.send({message:"User berhasil di buat",data:user});
  }).catch(function (err) {
    res.status(500).send({ message: "User gagal di buat"});
  });
});

app.get('/stat', async (req, res) => {
  if(await auth.verifyToken(req) == null){
    return res.status(401).send({ message : "Token tidak valid"});
  }
  var statController = new StatController();
  var result = await statController.index();
  res.send({message:"berhasil",data:result});
});


//get pelanggan
app.get('/pelanggan', async (req, res) => {
    if(await auth.verifyToken(req) == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var pelangganController = new PelangganController();
    var result = await pelangganController.index();
    res.send({message:"berhasil",data:result});
});


//update pelanggan
app.post('/pelanggan/:id', async (req, res) => {
  if(await auth.verifyToken(req) == null){
    return res.status(401).send({ message : "Token tidak valid"});
  }
  var pelangganController = new PelangganController();
  var result = await pelangganController.update(req.params.id,req);
  res.send({message:"berhasil",data:result});
});

//detail pelanggan
app.get('/pelanggan/:id', async (req, res) => {
  var pelangganController = new PelangganController();
  var result = await pelangganController.detail(req.params.id);
  res.send({message:"berhasil",data:result});
});

app.get('/tagihan-pelanggan/:id', async (req, res) => {
  var tagihanController = new TagihanController();
  var result = await tagihanController.getTagihanByPelanggan(req.params.id);
  res.send({message:"berhasil",data:result});
});

//create pelanggan
app.post('/pelanggan', async (req, res) => {
    var user = await auth.verifyToken(req);
    if(user == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var pelangganController = new PelangganController();
    var result = await pelangganController.create(req,user);
    if(result == null){
      res.status(500).send({ message: "pelanggan gagal di tambah"});
    } else {
      res.send({message:"berhasil menambah pelanggan",data:result});
    }
});

app.get('/tagihan', async (req, res) => {
  if(await auth.verifyToken(req) == null){
    return res.status(401).send({ message : "Token tidak valid"});
  }
  var tagihanController = new TagihanController();
  var result = await tagihanController.index();
  res.send({message:"berhasil",data:result});
});

//create tagihan
app.post('/tagihan', async (req, res) => {
  var user = await auth.verifyToken(req);
    if(user == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var tagihanController = new TagihanController();
    var result = await tagihanController.create(req);
    if(result == null){
      res.status(500).send({ message: "tagihan gagal di tambah"});
    } else {
      res.send({message:"berhasil menambah tagihan",data:result});
    }
});

//tagihan minggu ini yang belum lunas
app.get('/tagihan-minggu-ini', async (req, res) => {
  var user = await auth.verifyToken(req);
    if(user == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var pelangganController = new PelangganController();
    var result = await pelangganController.tagihanPelanggan7hari();
    if(result == null){
      res.status(500).send({ message: "tagihan gagal di muat"});
    } else {
      res.send({message:"berhasil memuat tagihan",data:result});
    }
});

app.post('/bayar-tagihan/:tagihan_id', async (req, res) => {
  var user = await auth.verifyToken(req);
    if(user == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var tagihanController = new TagihanController();
    var result = await tagihanController.bayarTagihan(req.params.tagihan_id,req);
    if(result == null){
      res.status(500).send({ message: "pembayaran gagal di tambah"});
    } else {
      res.send({message:"berhasil menambah pembayaran",data:result});
    }
});

app.post('/tambah-pembayaran/:pelanggan_id', async (req, res) => {
  var user = await auth.verifyToken(req);
    if(user == null){
      return res.status(401).send({ message : "Token tidak valid"});
    }
    var pelangganController = new PelangganController();
    var result = await pelangganController.tambahPembayaran(req.params.pelanggan_id,req);
    if(result == null){
      res.status(500).send({ message: "pembayaran gagal di tambah"});
    } else {
      res.send({message:"berhasil menambah pembayaran",data:result});
    }
});


app.get('/riwayat-pembayaran/:pelanggan_id', async (req, res) => {
  var pelangganController = new PelangganController();
  var result = await pelangganController.getRiwayatPembayaran(req.params.pelanggan_id);
  res.send({message:"berhasil",data:result});
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;