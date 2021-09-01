const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const gamesSchema = mongoose.Schema({
    _id:reqString,
    participants: {
        blue: {
            type: Array
        },
        red: Array
    },
   win: reqString
})

module.exports = mongoose.model('games', gamesSchema);