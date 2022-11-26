const User = require('../model/User');

exports.register = async (req, res) => {
    
    try {
        const { name, email, password, phone, place } = req.body;

        if(!name || !email || !password || !phone || !place){
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: 'Password should be atleast 8 characters'
            })
        }

        const user = await User.findOne({ $or:[ {email},{phone }] });

        if(user){
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        const newUser = await User.create({
            name,
            email,
            password,
            phone,
            place
        });

        const token = await newUser.generateToken();

        const options = {
            expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('token', token, options)
        .status(200)
        .json({
            success: true,
            message: 'User registered successfully',
            newUser
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            })
        }

        const user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = await user.generateToken();

        const options = {
            expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res
        .cookie('token', token, options)
        .status(200)
        .json({
            success: true,
            message: 'User logged in successfully',
            user
        })

    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

exports.logout = async (req, res) => {
    try{

        res.cookie('token', null, {expires:new Date(Date.now()), httpOnly:true})
        .status(200)
        .json({
            success: true,
            message: 'User logged out successfully'
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

exports.myProfile = async (req, res) => {
    try{

        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            message: "User profile",
            user
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

exports.updateProfile = async (req, res) => {
    try{

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
            })
        }

        const { name, phone, place } = req.body;

        if(!name || !phone || !place){
            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            })
        }

        user.name = name;
        user.place = place;

        // To check if the phone number is already registered
        if(phone !== user.phone){
            const phoneExists = await User.findOne({phone});
            if(phoneExists){
                return res.status(400).json({
                    success: false,
                    message: 'This Phone number is already registered'
                })
            }
            user.phone = phone;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user
        })

    }
    catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}