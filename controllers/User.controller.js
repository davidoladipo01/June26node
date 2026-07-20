const express = require("express");
const bcryptjs = require("bcryptjs");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const cloudinary= require("cloudinary").v2


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_SECRET
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_MAIL,
        pass: process.env.APP_PASSWORD
    }   
});




const registerPage = async (req, res) => {
    const users = await UserModel.find();
    res.render("registerUser", { users });
};

// const registerList= async (req,res)=>{
//         const users = await UserModel.find();
//     res.render("userList", { users })
// }

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, profilePicture } = req.body;
    try {
        const saltround = 10;
        const hashedPassword = await bcryptjs.hash(password, saltround);

        const image= await cloudinary.uploader.upload(profilePicture)

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture:{
                secure_url: image.secure_url,
                public_id:image.public_id
            }
        });

        const token = await jwt.sign({ id: user._id }, process.env.AUTH_SECRET, { expiresIn: "5h" })

        let mailOptions = {
            from: process.env.APP_MAIL,
            to: [`${email}`,"davidoladipo2025@gmail.com"],
            subject: 'Welcome to my APP',
            text: `You have been hacked ${firstName}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).send({
            message: "User created successfully",
            data: user,
            token
        })
        // res.status(200).send({message: "User created successfully", data:users})
    } catch (error) {
        console.error(error);

        return res.status(500).send({
            message: "User could not be created",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        const users = await UserModel.find();
        res.render("userList", { users });
    } catch (error) {
        console.log(error);
        res.status(400).send("User cannot be deleted");
    }
};

// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { email, password, ...updates } = req.body;

//         const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select("-password");
//         res.status(200).send({ message: "User updated successfully", data: updatedUser });
//     } catch (error) {
//         console.log(error);
//         res.status(400).send("User cannot be updated");
//     }
// }

const verifyUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
        ? req.headers.authorization?.split(" ")[1] : req.headers.authorization?.split(" ")[0];

    try {
        jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized user"
                });
            } else {
                console.log(decoded);

                req.user = decoded.id;
                next()
            }
        })
    } catch (err) {
        console.error();

    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find()

        res.status(200).send({
            message: "users fetched successfully",
            data: users
        })
    } catch (err) {
        console.error(err);

        res.status(400).send({ message: "Users failed to fetch" })

    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    try {
        const isUser = await UserModel.findById(id);
        if (!isUser) {
            res.status(400).send({ message: "error updating user" })

            return

        }

        const allowedUpdate = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
        }



        const updatedUser = await UserModel.findByIdAndUpdate(id, allowedUpdate, {
            returnDocument: "after",
        });
        res.status(200).send({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(400).send("User cannot be updated");
    }
};

const userList = async (req, res) => {
    try {
        const users = await UserModel.find();
        console.log(users);
        // res.status(200).send({message:"Users fetched successfullly", data:users})
        res.render("userList", { users });
    } catch (error) {
        console.log(error);
        res.status(400).send("Users cannot be fetched");
    }
};

const loginPage = (req, res) => {
    res.render("login", { error: null });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", { error: "Email and password are required." });
        }

        const user = await UserModel.findOne({ email }).select("+password");
        const token = await jwt.sign({ id: user._id }, process.env.AUTH_SECRET, { expiresIn: "5h" })

        if (!user) {
            return res.render("login", { error: "Invalid email or password." });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render("login", { error: "Invalid email or password." });
        }
        const { password: dbpassword, ...userWithoutPassword } = user.toObject();
        res
            .status(200)
            .send({ message: "Login successful", data: userWithoutPassword, token });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .render("login", { error: "Login failed. Please try again." });
    }
};

module.exports = {
    registerPage,
    registerUser,
    userList,
    deleteUser,
    loginPage,
    loginUser,
    updateUser,
    verifyUser,
    getAllUsers,
};
