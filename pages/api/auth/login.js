import dbConnect from '../../../lib/dbConnect'
const User = require("../../../models/user");

import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export default async function handler(req, res){
    try {
        await dbConnect();
        const { userName, password } = req.body;

        const user = await User.findOne({ userName });
        if (!user) {
            throw Error("User does not exist");
        } else if (!(await bcrypt.compare(password, user.password))) {
            throw Error("Incorrect username or password");
        }

        const token = jwt.sign({
                                id: user._id, 
                                permission: user.role, 
                                firstName: user.firstName, 
                                lastName: user.lastName, 
                                userName: user.userName 
                            }, process.env.JWT_SECRET_KEY);
                            
        if (!token) {
            throw Error("Couldn't sign token");
        }

        const serialised = serialize("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, //30 days
            path: "/",
        });

        res.setHeader("Set-Cookie", serialised);

        console.log("Signed in");
        res.status(200).json({token, user});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}