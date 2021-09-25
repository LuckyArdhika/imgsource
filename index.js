'use strict'

var express  = require('express');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 3000;
var path	 = require('path');
const fs = require('fs');
const multer = require("multer");
const upload_dir = path.join(__dirname, 'uploads/images'); // 1 method
// const aplot = './uploads'; // 2 method
// const fetch = require ('node-fetch'); //require -v >=16

app.use(morgan('dev')); // log every request to the console
app.use(express.urlencoded({extended: false})); //urlencoding
app.use(express.json()); // json reader
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(upload_dir)); // image files ( upload ), used or useleess?
app.use(express.static(path.join(__dirname, 'public'))); // styling
app.use(express.static(path.join(__dirname, 'pwa'))); // make public pwa static dir

const filetypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/pic', 'image/bmp', 'image/webp', 'image/jfif,'];

const handleError = (err, res) => {
res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};
  
const upload = multer({
dest: upload_dir,
limits: { fileSize: 	2097152 } // 2MB
// you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.get('/', (req, res) => {
  // membaca dir lalu hasil outputnya tanpa path, bagaimana cara agar hasil membaca dir berbentuk path?
  // files = menampilkan nama file
  console.log(upload_dir); // showing path dir
  fs.readdir(upload_dir, (err, files) => {
    // files.forEach(file => {
    //   const pt = path.join(__dirname, file);
    //   console.log(pt);
    // })
    // or
    // fetch(upload_dir).then(r => console.log(t))

    res.render('home.ejs',{files});
  });
});

// app.get("/uploads", (req, res) => {
//   res.render("./uploads")
// });

app.post("/uploads", upload.single("image" /* name attribute of <file> element in your form */), (req, res, next) => {
  const cek = req.file; // undefined when nothing file selected
  if (typeof(cek) == "undefined"){
    res.send("Upload Gagal, Pastikan anda memilih file gambar!");
  } else {
    console.log(req.file);
    const mime = req.file.mimetype;
    if (mime == "image/png" || mime == "image/jpg" || mime == "image/jpeg" || mime == "image/jfif") {
      console.log('conditional 1 executed');
      fs.readFile(req.file.path, (err) => {
        if (err){
          res.send("Something went wrong, please retry");
          console.error(err);
        } else {
          // rename filename with originalname here
          fs.rename(req.file.path, req.file.destination + "//" +req.file.originalname, function(err) {
            if ( err ){
              console.log('ERROR: ' + err);
            } else {
              res.send('File Uploaded! Return to the <a href="/">Home</a> page');
            }
          });
        }
      })
    } else if (req.file.mimetype == "text/javascript" || req.file.mimetype == "application/octet-stream" || req.file.mimetype == "text/x-python"){
      const tempPath = req.file.path;
      fs.unlink(tempPath, err => { // removing file from path/uploads dir
      res.end("Gausah macam macam deh lo, gunain aja fitur secukupnya gausah belagak sok heker cil bocil")
      })
    } else {
      console.log('conditional 2 executed');
      const tempPath = req.file.path
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);
        res
          .status(403)
          .contentType("text/plain")
          .end("Format file tidak didukung, pastikan ekstensi anda adalah salah satu dari berikut: (jpg, jpeg, png, jfif)");
      });
    }
  }
  }

  );

  app.listen(port, () => {
    console.log(`Connected to port ${port}`)
  })