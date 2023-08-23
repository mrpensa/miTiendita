const mongoose = require('mongoose');

const uri = `mongodb+srv://mrpensa:Marfl-97@cluster0.o5bnq7t.mongodb.net/store?retryWrites=true&w=majority`;

module.exports = async () => {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('\nConexión a la base de datos exitosa');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  };
  
