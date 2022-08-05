const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    activePlayers: [{ 
      userName: {type: String},
      firstName: {type: String},
      lastName: {type: String}, 
      section: {type: String}, 
      eliminated: {type: Number}, 
      friends: [{userName: {type: String}, firstName: {type: String}, lastName: {type: String}, section: {type: String}}],
      score: {type: Number}
    }],
    eliminatedPlayers: [
      { id: String, 
        userName: String, 
        firstName: String, 
        lastName: String, 
        section: String, 
        eliminator: {firstName: {type: String}, lastName: {type: String}, userName: {type: String}} },
    ],
    startDate: Date,
    immunities: [String],
    winner: String,
  },
  { collection: "Games" }
);

module.exports = mongoose.models.Game || mongoose.model("Game", gameSchema);
