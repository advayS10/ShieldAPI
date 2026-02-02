const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
        },
        password: {
            type: String,
            required: true,
            minlenght: 6
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Auth", AuthSchema)