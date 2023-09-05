const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
const dbConecction = require('../src/database/connection')
const env = require('dotenv').config()
const usersRouter = require('./routers/user.router')
const productsRouter = require('./routers/product.router')
dbConecction()




var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var store = new MongoDBStore({
  uri: process.env.URL,
  collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.disable('x-powered-by');
app.use(cors);


app.listen(3001, () => console.log('escuchando el puerto 3001'))