const productModel = require('../models/products')

class productRepository{


    async saveProduct(productObject){
        try {
            const newProduct = new productModel(productObject)
            return await newProduct.save();
        } catch (error) {
            return error;
        }
    }

}

module.exports = productRepository;