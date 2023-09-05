const connectDB = require("../database/connection");
const userModel = require("../models/users.js");
const productModel = require("../models/products.js");

class Manager{

//conexion a la base de datos para guardar todos los registros en un array
async search (typeModel) {

    await connectDB();
    //esto simplemente me permite devolver la lista de usuarios o producto
    const allUsers = await typeModel.find();
    return allUsers;
  };


 //devuelve todos los registros en la base de datos
async returnAll (typeModel) {

    try {
        console.log('hola')
        const allUsers = await this.search(typeModel);
        const names = [];
        if (allUsers.length === 0) {
          console.log.json({ message: "No hay usuarios registrados" });
        }
        //cambiar 'name' por algo que tambien tengan los productos
        allUsers.forEach((user) => {
          names.push(user.name);
        });
        console.log(names.join(", "));
      } catch (er) {
        console.error(er);
      }
}
}


module.exports = Manager;