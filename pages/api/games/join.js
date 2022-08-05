import dbConnect from "../../../lib/dbConnect";
const User = require("../../../models/user");
const Game = require("../../../models/game");

export default async function handler(req, res) {
  const { _id, user } = req.body;
  if(req.method === "PATCH") {
    try {
      await dbConnect();
      await User.updateOne(
        { userName: user.userName },
        { $push: {"gamesPlayed": {
            gameId: _id,
            gameTitle: "",
            targets: [],
            eliminated: 0,
            isActive: true,
            isWinner: false
          }},
          $inc: {
            "statistics.gamesPlayed" : 1
          }
        }
      );

      await Game.updateOne(
        { _id: _id },
        { $push: {"activePlayers": {
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            section: user.section,
            friends: user.friends,
            score: 0,
        }}}
      );
      res.status(201).json("Successfully opted into game");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}