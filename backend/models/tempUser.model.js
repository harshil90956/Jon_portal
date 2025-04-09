import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    phoneNumber: Number,
    password: String,
    role: String,
    profilePhoto: String,
    otp: String,
    otpExpire: Date,
}, { timestamps: true });

export const TempUser = mongoose.model('TempUser', tempUserSchema);
