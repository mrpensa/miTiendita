const productController = {};
//const connectDB = require("../dbConecction/conecction");
const productRouter = require('express').Router();

const productModel = require("../models/products.js");
const validationProduct = require("../validations/product.validations.js");
const productRepository = require("../repositories/productRepository.js");
//conexion a la base de datos para guardar todos los users en un array

const productRepo = new productRepository();


//devuelve todos los users registrados en la base de datos
productRouter.get("/get", async (req, res) => {
  try {
    console.log('hola')
    const allUsers = await productRepo.getAll();
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
});

//verificar como pasar imagen por defecto en caso de no haber
//verificar como identificar quien esta logueado justo en la sesion (que pasa si hay 5 personas logueadas al mismo tiempo)
productRouter.post("/create", (req, res) => {
  if (!req.session.uid)
    return res.status(400).json({ message: "no pueden quedar datos vacios" });

  const validation = new validationProduct();
  let { name, description, image, price } = req.body;

  if (
    !(validation.correctString(name) && validation.correctString(description))
  )
    return res.status(400).json({ message: "no pueden quedar datos vacios" });

  if (!validation.minPrice(price))
    return res.status(400).json({ message: "El precio debe ser mayor a 0" });

  const idUser = req.session.uid;

  let imageDefault =
    image ??
    "https://becagrafic.com/wp-content/uploads/2019/09/imagen-no-disponible.jpg";

  const productNew = productRepo.saveProduct({
    idUser,
    name,
    description,
    image: imageDefault,
    price,
  });

  if (productNew instanceof Error)
    return res.status(401).json({ message: "tienes un error mi pana" });

  return res.json({ message: `Producto agregado con exito` });
});

module.exports = productRouter;
