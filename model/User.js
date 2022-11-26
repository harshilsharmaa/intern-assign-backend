const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    phone:{
        type: Number,
        required: true,
        unique: true,
    },
    place:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET);
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);

