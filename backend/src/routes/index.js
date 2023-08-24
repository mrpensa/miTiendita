const express = require('express')
const router = express.Router()
const controller = require('../controllers/user.controller.js')

router.get('/allUsers', controller.index);
router.post('/newUser', controller.register);
router.delete('/removeUser/:name', controller.remove)
router.post('/login', controller.login)

module.exports = router;
