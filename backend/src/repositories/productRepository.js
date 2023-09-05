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

    async getAll(){
        return await productModel.find();
    }

}

module.exports = productRepository;