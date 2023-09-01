const mongoose = require('mongoose');
const {Schema} = mongoose

const ProductModel = new Schema({
    idUser: {
      type: String,
      require: true
    },
    name: {
        type: String,
        required: true
      },
    description: {
        type: String,
        required: true
      },
    image: {
        type: String,
        require: true
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

module.exports = productModel;