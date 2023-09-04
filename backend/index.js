const express = require("express"); 
const connectDb = require("./src/dbConecction/connection.js");

const cors = require("cors");
const app = express();

app.disable("x-powered-by");
app.use(express.json());
//BETTER ROUTING 
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use(cors);
