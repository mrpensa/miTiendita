const validator = require('validator')
const connectDB = require('../database/connection')
const userModel = require('../models/users.js')

class Validation{

    correctString(string){
        return string != null && !validator.isEmpty(string);      
    }

    correctEmail(mail){
        return validator.isEmail(mail);
    }

    minRequirement(password){
        return validator.isStrongPassword(password)
    }
}

module.exports = Validation;

