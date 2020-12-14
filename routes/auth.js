const express = require('express');
const {registerUser} = require('../controllers/auth')

const authRouter = express.Router();

authRouter
    .route('/register')
    .post(registerUser)

module.exports = authRouter    


