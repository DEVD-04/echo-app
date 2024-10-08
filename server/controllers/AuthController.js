import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs";

const maxAge = 24 * 3600 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
}

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(409).send("User already exists.");
        }

        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // image : user.image,
                profileSetup: user.profileSetup,
            },
        });
    }
    catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }


}

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.");
        }

        const user = await User.findOne({email});
        if(!user) {
            return response.status(404).send("User with this email id not found");
        }
        const checkPassword= await compare(password, user.password);
        if(!checkPassword){
            return response.status(400).send("Incorrect password")
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image : user.image,
                profileSetup: user.profileSetup,
            },
        });
    }
    catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (request, response, next) => {
    try{
        const userData = await User.findOne({ _id: request.userId });    //getting userId after verifying token, done in middleware
        if(!userData){
            return response.status(404).send("User with this id id not found");
        }
        return response.status(200).json({
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image : userData.image,
                profileSetup: userData.profileSetup,
            
        });
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const updateProfile = async (request, response, next) => {
    try{
        const {userId} =request;
        const {firstName, lastName}=request.body;
        if(!firstName || !lastName){
            return response.status(400).send("Firstname and Lastname required");
        }
        const userData= await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName,
                profileSetup:true,
            },
            {new:true, runValidators:true}
        );
        return response.status(200).json({
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image : userData.image,
                profileSetup: userData.profileSetup,
            
        });
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const addProfileImage = async (request, response, next) => {
    try{
        if(!request.file){
            return response.status(400).send("File required");
        }
        const date=Date.now();
        let fileName= "uploads/profiles/"+date+request.file.originalname;
        renameSync(request.file.path, fileName);

        const updatedUser = await User.findByIdAndUpdate({ _id: request.userId }, {image:fileName}, {new:true, runValidators:true});

        return response.status(200).json({
                image : updatedUser.image,
            
        });
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const removeProfileImage = async (request, response, next) => {
    try{
        const {userId} =request;
        const user= await User.findById(userId);
        if(!user) return response.status(404).send("User Not Found");
        if(user.image) {
            unlinkSync(user.image);
        } 
        user.image=null;
        await user.save();
        
        return response.status(200).send("Profile Image Removed Successfully");
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const logout = async (request, response, next) => {
    try{
        response.cookie("jwt","",{maxAge:1, secure:true, sameSite:"None"})
        return response.status(200).send("Logout Successful");    
    }catch(error){
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};