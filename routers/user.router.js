const express = require('express');

const userRouter = express.Router();

const { 
    register, 
    login, 
    logout, 
    myProfile, 
    updateProfile
    // forgotPassword, 
    // resetPassword, 
    // updateDetails, 
    // updatePassword 
} = require('../controllers/user.controller');

const {
    authenticate
} = require('../middleware/auth');

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/profile/me').get(authenticate, myProfile);
userRouter.route('/profile/update').put(authenticate, updateProfile);

module.exports = userRouter;