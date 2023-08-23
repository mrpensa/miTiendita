const mongoose = require('mongoose');
const {Schema} = mongoose

const ProductModel = new Schema({
    idUser: {
      type: String,
    },
    tittle: {
        type: String,
        required: true
      },
    description: {
        type: String,
        required: true
      },
    image: {
        type: String
      },
    price: {
        type: Number,
        require: true
      }
}, 
{
    versionKey: false // Esto deshabilita el campo __v
});

const productModel = mongoose.model('products', ProductModel);

module.exports = userModel;