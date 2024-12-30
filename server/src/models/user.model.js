import mongoose, {Schema} from "mongoose";
import  jwt  from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'UserName is required'],
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },

    refreshToken: {
        type: String
    },

    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'admin' 
    },

},{timestamps:true});

//jwt is a bearer token it means the person bear this token we give the access to that person its kind of chavi
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

export const User = mongoose.model("User", userSchema);