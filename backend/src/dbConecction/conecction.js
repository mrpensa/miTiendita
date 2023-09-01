const mongoose = require('mongoose');
const env = require('dotenv').config()

const uri = process.env.URL

module.exports = async () => {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('\nConexión a la base de datos exitosa');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  };
  
