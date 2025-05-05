import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";
import cloudinary  from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required!!",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!!",
      });
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      fullName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      // generate jwt in utils/utils.js then call it.
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error, message);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({message: "Invalid email or password"});
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({message: "Invalid email or password"});
    }
    generateToken(user._id,res)
    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic
    })
  } catch (error) {
    console.log("Error in login controllers:", error.message);
    res.status(500).json({message: "Internal server error "})
    
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt","",{ maxAge:0})
    res.status(200).json({message: " Logged out Successfully"})
    
  } catch (error) {
    console.log("Error in logout controllers:", error.message);
    res.status(500).json({message: "Internal server error "})
  }
};

export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id
    if (!profilePic) {
      return res.status(400).json({message:"Profile pic is required."})
    }
    const uploadResponse =  await cloudinary.uploader.upload(profilePic)
    const updatedUser = await userModel.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
     res.status(200).json(updatedUser)
  } catch (error) {
    console.log("Error in update profile controllers:", error.message);
    res.status(500).json({message: "Internal server error "})
  }
}

export  const checkAuth =async (req,res) => {
   try {
    res.status(200).json(req.user)
   } catch (error) {
    console.log("Error in Check controllers:", error.message);
    res.status(500).json({message: "Internal server error "})
   }
}
