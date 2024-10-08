import mongoose from "mongoose"
import {genSalt,hash} from "bcrypt"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required."],
        unique: true,
    },
    password: {
    type: String,
    required: [true, "Password is Required."], 
    },
    firstName: {
        type: String,
        required: false,
    },

    lastName: {
        type: String,
        required: false,
    },
    image:{
        type: String,        
        required: false,
    },
    profileSetup:{      // only possible to access chat application after profile setup
        type: Boolean,
        default: false,
    },
});

// pre is middleware provided by mongodb, 
// by which we ensure before saving data do encryption function
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt= await genSalt();
    this.password= await hash(this.password, salt);
    next();
});

const User= mongoose.model("Users", userSchema);
export default User;