const express = require('express')
const router = require('./routes/index.js')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express()
const dbConecction = require('../src/dbConecction/conecction.js')
dbConecction()


app.disable('x-powered-by');
app.use(express.json());
app.use(router);
app.use(cors);


app.listen(3001, () => console.log('escuchando el puerto 3001'))