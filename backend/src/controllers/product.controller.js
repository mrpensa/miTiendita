const productController = {};
//const connectDB = require("../dbConecction/conecction");
const productModel = require("../models/products.js");
const Manager = require('./manager.js')
//conexion a la base de datos para guardar todos los users en un array

const manager = new Manager();
//devuelve todos los users registrados en la base de datos
productController.index = async (req, res) => {
  return await manager.returnAll(productModel);
};


module.exports = productController;