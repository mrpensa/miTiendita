const controller = {};
const connectDB = require("../dbConecction/conecction");
const userModel = require("../models/users.js");
const { param, search } = require("../routes");
const crypto = require("crypto");
const validationUser = require("../validations/user.validations.js");
const Manager = require('./manager.js')
const UserRepository = require('../repositories/userRepository');
const Validation = require("../validations/user.validations.js");
//conexion a la base de datos para guardar todos los users en un array

const manager = new Manager()
const userRepository = new UserRepository()
const validation = new validationUser()
//devuelve todos los users registrados en la base de datos
controller.index = async (req, res) => {
  return await manager.returnAll(userModel);
};

//registra un nuevo user a la base
controller.register = async (req, res) => {

   
    let { name, mail, password } = req.body;
    //// mejorar esta busqueda con un find y cambiarlo para que lo busque por mail y no por nombre
    mail = mail.toLowerCase();
    const searchUser = await userRepository.findByEmail(mail);
    if(searchUser.error){
      console.log(searchUser.error)
      return res.status(500).json({message: 'Error interno del servidor'})
    }

    if(searchUser.user !== null){
      return res.json({message: `Ya existe el mail indicado`})
    }

    //Verificar el salto de linea
    if (!validation.minRequirement(password)) {
      return res.status(400).json({
        message: `La password no cumple los requisitos minimos. Se requiere:\n
            Mínimo de 8 caracteres de longitud.\n
            Al menos una letra minúscula.\n
            Al menos una letra mayúscula.\n
            Al menos un dígito numérico.\n
            Al menos un carácter especial (como !@#$%^&*).`,
      });
    }

    if (
      validation.correctString(name) &&
      validation.correctEmail(mail) 
    ) {
      //////////////////////////// modificar de acuerdo al schema
      const passwordSalt = crypto.randomBytes(128).toString("base64");
      const encryptionCycles = crypto.randomInt(5000, 10000);
      const passwordHash = crypto
        .pbkdf2Sync(password, passwordSalt, encryptionCycles, 512, "sha512")
        .toString("base64");

      
      const save =  userRepository.saveUser({
        name,
        mail,
        passwordHash,
        passwordSalt,
        encryptionCycles,
      });

      if(save instanceof Error) {
        return res.status(401).json({message: 'tienes un error mi pana'})
      }

      console.log(JSON.stringify(`Se registro con exito a ${req.body.name}`));
      res.status(201);
    } else {
      console.log("Hay un error en los datos proporcionados");
    }
 
};

//elimina un usuario de la base
//mejorar la manera en la que se elimina un usuario, no deberia ser por nombre
controller.remove = async (req, res) => {
  try {
    const userRepository = new UserRepository()
    const name = req.params.name;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Nombre del usuario no proporcionado en la URL." });
    }

    const searchUser = userRepository.findById(req.body._id)

    if (searchUser !== null) {
      userRepository.removeUser(searchUser._id);
      return res
        .status(204)
        .json({ message: `Se eliminó el usuario elegido ${name}` });
    }

    console.log("No se encontró el usuario elegido");
    return res
      .status(404)
      .json({ message: "No se encontró el usuario para eliminar" });
  } catch (err) {
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



controller.login = async (req, res) => {
  console.log(req.body)
  try {
    const { mail, password } = req.body;
    
    //mover a user repository?
    const m = mail.toLowerCase()
    await connectDB()
    const userSearch = await userModel.findOne({mail: m});

    if (userSearch == null) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //crear funcion para reutilizar este paso
    const passwordHash = crypto
      .pbkdf2Sync(
        password,
        userSearch.passwordSalt,
        userSearch.encryptionCycles,
        512,
        "sha512"
      )
      .toString("base64");

    if(passwordHash !== userSearch.passwordHash) {
        console.log(userSearch)
        return res.status(401).json({ message: "Credenciales invalidas" });
    } 

    req.session.uid = userSearch._id
    return res.status(200).json({ message: `Welcome ${userSearch.name}` });
  } catch (err) {
    console.log("error" + err);
  }
};

//configurar para cambiar mas datos
controller.changeProfile = async (req, res) => {

  const {_id, name} = req.body;

  if(!(validation.correctString(name))) {
    return res.status(400).json({message: `Falta completar algun campo`})
  }

  if(req.session.uid != _id){
    //corregir respuesta
    //Siempre me va a venir por este camino, necesito guardar el usuario logueado para mantener su ID de alguna manera
      //como hago si se loguean 5 usuarios al mismo tiempo
    console.log(req.session.uid)
    console.log(req.body)
    return res.status(400).json({message: `No estas logueado con el mismo user`})
  }

  const saveChange = validation.changeProfile({name})
  if(saveChange instanceof Error){
    return res.status(400).json({message: `Hay un error con los datos proporcionados`})
  }

  return res.json({message: `Cambios realizados con exitos`})
}

module.exports = controller;
