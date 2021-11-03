const {diskStorage} = require('multer');
const moment = require('moment-timezone');

const dateIndonesia = moment.tz(Date.now(), "Asia/Jakarta");

exports.fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime()+'.jpg'); //+'-'+file.originalname
  }
})

exports.fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}