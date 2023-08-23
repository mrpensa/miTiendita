const controller = {}
const connectDB = require('../dbConecction/conecction')
const userModel = require('../models/users.js')
const { param } = require('../routes')
const crypto = require('crypto')
const validationUser = require('../validations/user.validations.js')

//conexion a la base de datos para guardar todos los users en un array
const search = async () => {
    await connectDB()
    const allUsers = await userModel.find();
    return allUsers;
}

//devuelve todos los users registrados en la base de datos
controller.index = async (req, res) => {
    try {
        const allUsers = await search();
        const names = [];
        if (allUsers.length === 0) {
            res.status(200).json({ message: "No hay usuarios registrados" })
        }
        allUsers.forEach(user => {
            names.push(user.name)
        })
        console.log(names.join(', '))
        //return res.json(allUsers);
    } catch (er) {
        console.error(er)
    }

}

//registra un nuevo user a la base
controller.register = async (req, res) => {

    try {
        const validation = new validationUser();
        const { name, mail, password } = req.body;
        //// mejorar esta busqueda con un find y cambiarlo para que lo busque por mail y no por nombre
        const allUsers = await search();
        const names = []
        allUsers.forEach(user => {
            names.push(user.name)
        })
        if (validation.correctString(name) && validation.correctEmail(mail) && validation.userNotExists(mail)) {
            //////////////////////////// modificar de acuerdo al schema
            const passwordSalt = crypto.randomBytes(128).toString("base64");
            const encryptionCycles = crypto.randomInt(5000, 10000);
            const passwordHash = crypto
                .pbkdf2Sync(password, passwordSalt, encryptionCycles, 512, "sha512")
                .toString("base64");

            const newUser = new userModel({ name, mail, passwordHash, passwordSalt, encryptionCycles });
            await newUser.save();
            console.log(JSON.stringify(`Se registro con exito a ${newUser}`));
            res.status(201);
        } else {
            console.log('Hay un error en los datos proporcionados')
        }

    } catch (error) {
        console.error(`No se pudo registar al nuevo usuario ${error}`);
    }
}

//elimina un usuario de la base
controller.remove = async (req, res) => {
    try {
        const name = req.params.name;

        if (!name) {
            return res.status(400).json({ message: 'Nombre del usuario no proporcionado en la URL.' });
        }

        const allUsers = await search();
        const searchUser = allUsers.find(u => u.name === name);
        console.log(searchUser._id)
        if (searchUser) {
            await userModel.findByIdAndDelete(searchUser._id);
            return res.status(204).json({message: `Se eliminó el usuario elegido ${name}`});
        }

        console.log('No se encontró el Pokémon elegido');
        return res.status(404).json({ message: 'No se encontró el usuario para eliminar' });

    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

module.exports = controller;