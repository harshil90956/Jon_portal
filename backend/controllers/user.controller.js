import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { TempUser } from "../models/tempUser.model.js";
import { sendOTP } from "../utils/sendOTP.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);
        
        // Save to TempUser
        await TempUser.findOneAndDelete({ email }); // remove previous attempts if any

        await TempUser.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profilePhoto: cloudResponse.secure_url,
            otp,
            otpExpire: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        // Send OTP to user's email
        await sendOTP(email, otp);

        return res.status(200).json({ message: "OTP sent to email", success: true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(email, otp);
    

    try {
        const tempUser = await TempUser.findOne({ email:email });

        if (!tempUser) {
            return res.status(400).json({ message: "No registration found", success: false });
        }

        if (tempUser.otp !== otp || tempUser.otpExpire < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        await User.create({
            fullname: tempUser.fullname,
            email: tempUser.email,
            phoneNumber: tempUser.phoneNumber,
            password: tempUser.password,
            role: tempUser.role,
            profile: {
                profilePhoto: tempUser.profilePhoto,
            }
        });

        await TempUser.deleteOne({ email });

        return res.status(201).json({ message: "Account verified and created", success: true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}