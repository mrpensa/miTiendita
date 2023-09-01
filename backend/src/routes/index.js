const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller.js')
const productController = require('../controllers/product.controller.js')

router.get('/allUsers', controller.index);
router.post('/newUser', controller.register);
router.delete('/removeUser/:name', controller.remove)
router.post('/login', controller.login)
router.put('/changeProfile', controller.changeProfile)

router.get('/allProducts', productController.index);
router.post('/newProduct', productController.register);


module.exports = router;
