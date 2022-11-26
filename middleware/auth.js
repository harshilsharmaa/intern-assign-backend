const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized, Please Login First'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        req.user = user;

        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}