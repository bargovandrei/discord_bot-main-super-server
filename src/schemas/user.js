const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true
}

const userSchema = mongoose.Schema({
    _id:reqString,
    user:reqString,
    guildId: reqString,
    lolNickname: reqString,
    league: {
        type: Number
    },
    lp:{
        type: Number
    },
    wins:{
        type: Number
    },
    loses:{
        type: Number
    },
    inQue:{
        type: Number
    },
})
module.exports = mongoose.model('users', userSchema);