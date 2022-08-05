import dbConnect from '../../../lib/dbConnect'
const User = require("../../../models/user");
const Game = require("../../../models/game");

export default async function handler(req, res){
    const { gameId, eliminator, eliminated } = req.body;
        //the eliminator username gets passed here
        //the eliminated WHOLE OBJECT gets passed here
        //newTarget is the username of the new target
    try {
        await dbConnect();
        
        //update the active and eliminated players in the game
        await Game.updateOne({_id: gameId,},
            {
                $pull: {   
                    activePlayers : { userName: eliminated.userName }
                },
                $push: {
                    eliminatedPlayers : {
                        id: eliminated._id,
                        userName: eliminated.userName,
                        firstName: eliminated.firstName,
                        lastName: eliminated.lastName,
                        section: eliminated.section,
                        eliminator: {userName: eliminator.userName, firstName: eliminator.firstName, lastName: eliminator.lastName}
                    }
                }
            }
        );

        await Game.updateOne({_id: gameId}, {$inc: {"activePlayers.$[eliminator].score": 1}}, {arrayFilters: [{"eliminator.userName" : eliminator.userName}]});

        //sort activePlayers by their score
        var game = await Game.findOneAndUpdate({_id: gameId}, {$push: {activePlayers: {$each: [], $sort: 1}}}, {returnNewDocument: true});

        //update the eliminated person's statistics and find the new target
        const elim = await User.findOneAndUpdate({userName: eliminated.userName}, 
            {$set: {"gamesPlayed.$[updateGamesPlayed].isActive" : false}},
            {
                "arrayFilters": [{"updateGamesPlayed.gameId" : gameId}],
                select: { 
                    gamesPlayed: {
                       $elemMatch: 
                       {   gameId : gameId } 
                    }
                }
            }
        );
        
        const targets = elim.gamesPlayed[0].targets;
        const newTarget = targets[targets.length-1];

        if (game.activePlayers.length===1) {
            //if there is only one player left
            game.status = "ended";
            game.winner = eliminator.userName;
            await game.save();
            
            //update winner statistics
            var winner = await User.updateOne({userName: eliminator.userName}, 
                {
                    $inc: {   
                        "statistics.gamesWon" : 1, 
                        "gamesPlayed.$[updateGamesPlayed].eliminated" : 1, 
                        "statistics.eliminations" : 1
                    },
                    $set: {"gamesPlayed.$[updateGamesPlayed].isWinner": true}
                },
                {"arrayFilters": [{"updateGamesPlayed.gameId" : gameId}]}
            );
        } else {
            //assign new target
            await User.updateOne(
                {
                    userName: eliminator.userName,
                }, 
                {
                    $push: {   
                        "gamesPlayed.$[updateGamesPlayed].targets" : newTarget
                    },
                    $inc: {
                        "gamesPlayed.$[updateGamesPlayed].eliminated" : 1
                    },
                    $inc: {
                        "statistics.eliminations" : 1
                    }
                },
                {
                    "arrayFilters": [
                        {"updateGamesPlayed.gameId" : gameId},
                    ]
                }
            );
        }

        res.status(201).json("Successfully removed target");
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}