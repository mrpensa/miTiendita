const userModel = require('../models/users')

class UserRepository{

    async findByEmail(email){
        const parametros = {}
        try {
            parametros.user = await userModel.findOne({mail: email});
        } catch (error) {
            parametros.error = error
        }
        return parametros;
    } 

    async findById(_id){
        try {
            return await userModel.findById(_id);
        } catch (error) {
            return error;
        }
    } 

    async saveUser(userObject){
        try {
            const newUser = new userModel(userObject)
            return await newUser.save();
        } catch (error) {
            return error;
        }
    }


    async removeUser(id){
        try {
            return await userModel.findByIdAndDelete(id)
        } catch (error) {
            return error;
        }
    }

}

module.exports = UserRepository;