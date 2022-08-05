import dbConnect from '../../../lib/dbConnect'
const User = require("../../../models/user");
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export default async function handler(req, res){
    const { userName, password } = req.body;

    try {
        await dbConnect();
        var u = await User.findOne({userName});

        if (u) {
            res.status(500).json({message: "User already exists"});
        } else {
            const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT));
            if (!salt) {
                throw Error("Something went wrong with bcrypt");
            }

            const hashedPw = await bcrypt.hash(password, salt);
            if (!hashedPw) {
                throw Error("Something went wrong with password hashing");
            }

            const user = new User(req.body);
            user.password = hashedPw;
            user.playedGames = [];
            user.statistics = {
                gamesPlayed : 0,
                gamesWon : 0,
                eliminations: 0
            };
            const newUser = await user.save();

            const token = jwt.sign({
                id: user._id, 
                permission: user.role, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                userName: user.userName 
            }, process.env.JWT_SECRET_KEY);

            const serialised = serialize("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30, //30 days
                path: "/",
            });

            res.setHeader("Set-Cookie", serialised);
    
            res.status(201).json({token, user});
        }
        // res.send("hi");
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}