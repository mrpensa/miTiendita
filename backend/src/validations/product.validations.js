const validator = require('validator')
const connectDB = require('../dbConecction/conecction.js')
const userModel = require('../models/users.js')

class Validation{

    correctString(string){
        return string != null && !validator.isEmpty(string);      
    }

    minPrice(price){
        return price > 0;
    }
}

module.exports = Validation;