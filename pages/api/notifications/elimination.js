import dbConnect from '../../../lib/dbConnect'
import user from '../../../models/user';
const User = require("../../../models/user");

export default async function handler(req, res){
    const { sender, target, gameId } = req.body;

    try {
        await dbConnect();

        const obj = {
            header: sender.userName,
            sender: {
                userName: sender.userName,
                firstName: sender.firstName,
                lastName: sender.lastName
            },
            message: "has eliminated you",
            type: "elimination",
            timeStamp: new Date(),
            gameId: gameId
        }

        const results = await User.updateOne({userName: target}, {$push: {notifications: obj}});
        res.status(201).json(results);
    } catch (err) {
        res.status(500).json({message: err});
    }
}