const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const checkMulter = require('./src/models/image')
const auth = require('./src/routes/auth');
const blog = require('./src/routes/blog');
const category = require('./src/routes/category');

const app = express();
const PORT = process.env.PORT || 4000;
mongoose.Promise = global.Promise

app.use(bodyParser.json());
app.use('/assets/images', express.static(path.join(__dirname, './assets/images')));
app.use(multer({storage:checkMulter.fileStorage, fileFilter:checkMulter.fileFilter}).single('image'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})


app.use('/v1/auth', auth);
app.use('/v1/category', category);
app.use('/v1/blog', blog);

app.use((req, res) => {
  const err = new Error('Request not found');
  err.errorStatus = 404;
  throw err;
});

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data || true;
  res.status(status).json({message, error: data })
})

mongoose.connect(process.env.DB_MONGOOSE, {
  useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, ()=>{
      console.log(`http://localhost:${PORT}`); 
      console.log('Connection Success !!!');
    });
  })
  .catch(err => {
    console.log(err);
  })



