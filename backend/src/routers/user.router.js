const usersRouter = require("express").Router();
const connectDB = require("../database/connection");
const userModel = require("../models/users.js");
const crypto = require("crypto");
const validationUser = require("../validations/user.validations.js");
const UserRepository = require("../repositories/userRepository");

//conexion a la base de datos para guardar todos los users en un array

const userRepository = new UserRepository();
const validation = new validationUser();

usersRouter.get("/get", async (req, res) => {
  try {
    console.log("hola");
    const allUsers = await userRepository.getAll();
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

//registra un nuevo user a la base
usersRouter.post("/create", async (req, res) => {
  let { name, mail, password } = req.body;
  //// mejorar esta busqueda con un find y cambiarlo para que lo busque por mail y no por nombre
  mail = mail.toLowerCase();
  const searchUser = await userRepository.findByEmail(mail);
  if (searchUser.error) {
    console.log(searchUser.error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }

  if (searchUser.user !== null) {
    return res.json({ message: `Ya existe el mail indicado` });
  }

  //Verificar el salto de linea
  if (!validation.minRequirement(password)) 
    return {
      error: {
        message: `La password no cumple los requisitos minimos. Se requiere:\n
            Mínimo de 8 caracteres de longitud.\n
            Al menos una letra minúscula.\n
            Al menos una letra mayúscula.\n
            Al menos un dígito numérico.\n
            Al menos un carácter especial (como !@#$%^&*).`,
      },
  }

  if (!validation.correctString(name) || !validation.correctEmail(mail))
    return res.status(400).json({ message: "Datos invalidos" });

  const passwordSalt = crypto.randomBytes(128).toString("base64");
  const encryptionCycles = crypto.randomInt(5000, 10000);
  const passwordHash = crypto
    .pbkdf2Sync(password, passwordSalt, encryptionCycles, 512, "sha512")
    .toString("base64");

  const save = userRepository.saveUser({
    name,
    mail,
    passwordHash,
    passwordSalt,
    encryptionCycles,
  });

  if (save instanceof Error) {
    return res.status(401).json({ message: "tienes un error mi pana" });
  }

  console.log(JSON.stringify(`Se registro con exito a ${req.body.name}`));
  res.status(201);
});

//elimina un usuario de la base
//mejorar la manera en la que se elimina un usuario, no deberia ser por nombre
usersRouter.post("/delete", async (req, res) => {
  const userRepository = new UserRepository();
  const name = req.params.name;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Nombre del usuario no proporcionado en la URL." });
  }

  const searchUser = userRepository.findById(req.body._id);

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
});

usersRouter.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.session.uid != null) {
    return res.status(401).json({ message: "Ya estas logeado" });
  }
  const { mail, password } = req.body;

  //mover a user repository?
  const m = mail.toLowerCase();
  await connectDB();
  const userSearch = await userModel.findOne({ mail: m });

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

  if (passwordHash !== userSearch.passwordHash) {
    console.log(userSearch);
    return res.status(401).json({ message: "Credenciales invalidas" });
  }

  req.session.uid = userSearch._id;

  return res.status(200).json({ message: `Welcome ${userSearch.name}` });
});

//configurar para cambiar mas datos
usersRouter.put("/update", async (req, res) => {
  const { name, password } = req.body;

  if (!req.session.uid)
    return res.status(401).json({
      message: "No estas autorizado a ejecutar esta accion",
    });

  if (!validation.correctString(name))
    return res.status(400).json({ message: `Falta completar algun campo` });

  const userOrError = await userRepository.findById(req.session.uid);

  if (userOrError instanceof Error)
    return res.status(401).json({
      message: "no estas autorizado a ejecutar esta accion",
    });
  //  TODO: DO SOMETHING IF USER IS NOT FOUND
  console.log(userOrError);
  const passwordHash = crypto
    .pbkdf2Sync(
      password,
      userOrError.passwordSalt,
      userOrError.encryptionCycles,
      512,
      "sha512"
    )
    .toString("base64");

  if (passwordHash != userOrError.passwordHash)
    return res.status(401).json({
      message: "no estas autorizado a ejecutar esta accion",
    });

  userRepository.saveUser({ name });
  return res.json({ message: `Cambios realizados con exitos` });
});

usersRouter.get("/logout", async (req, res) => {
  req.session.uid = undefined;
  res.json({ message: `deslogueado` });
});

module.exports = usersRouter;
