const mongoose = require('mongoose');
const userSchema = require("../../schemas/user");
const gamesSchema = require("../../schemas/games");
const constants = require('./../../utils/structures/constants')

class MongoCmd {

    /**
     * @param {string} [dbUrl] - A valid mongo database URI.
     */

    static async setURL(dbUrl) {
        if (!dbUrl) throw new TypeError("A database url was not provided.");
        mongoUrl = dbUrl;
        return mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    }

    static async userOutOfQue(player) {
        if (!player) throw new TypeError("An user was not provided.");

        const user = await userSchema.findOne({
            lolNickname: player
        });

        user.inQue = 2;

        await user.save().catch(e => console.log(`Failed to save state: ${e}`));

        return
    }

    static async updateQueStatus(player, que) {
        if (!player) throw new TypeError("An user was not provided.");

        const user = await userSchema.findOne({
            lolNickname: player[0].lolNickname
        });
        user.inQue = que;

        await user.save().catch(e => console.log(`Failed to save state: ${e}`));

        return user
    }

    static async searchUserinQue() {
        const user = await userSchema.find({
            inQue: 1
        });
        if (!user) return false;
        return user
    }

    static async getAllPlayers() {
        const user = await userSchema.find({});
        if (!user) return false;
        return user
    }

    static async searchUserCommand(author_id) {
        const user = await userSchema.find({
            _id: author_id
        });
        if (!user) return false;
        return user
    }

    static async searchPlayersInQue() {
        const user = await userSchema.find({
            inQue: 1
        });
        return user
    }

    static async updatePlayersQue(players, queStatus) {
        await userSchema.updateMany({
            inQue: queStatus
        }).where('lolNickname').in(players)
        return
    }

    static async createUser(author, guild, args) {
        await new userSchema({
            _id: author.id,
            guildId: guild.id,
            user: author.username,
            lolNickname: args,
            league: 1,
            lp: 0,
            wins: 0,
            loses: 0,
            inQue: 0
        }).save()
        return
    }

    static async createGame(players) {
        const game = await new gamesSchema({
            _id: '_' + Math.random().toString(36).substr(2, 9),
            participants: {
                blue: [players[0]],
                red: [players[1]]
            },
            win: 0
        }).save()
        return game
    }

    static async searchGame(game_id) {
        if (!game_id) return false;
        const game = await gamesSchema.find({
            _id: game_id
        });
        return game
    }

    static async searchGameByPlayer(player) {
        if (!player) return false;
        const game = await gamesSchema.find({
            $or: [{
                "participants.red": player[0].lolNickname
            }, {
                "participants.blue": player[0].lolNickname
            }]
        })
        return game
    }

    static async delete() {

        const files = await gamesSchema.deleteMany({
            _id: '_7i0oz42tv'
        })
        return files
    }

    static async updateGame(game_id, win) {
        await gamesSchema.updateOne({
            _id: game_id
        }, {
            win: win
        })
        return
    }

    static async updatePlayersScore(red_team, blue_team, teamWin) {
        let rank_arr = constants.rank_set;
        let current_lp_red = 0;
        let current_lp_blue = 0;

        const red_team_players = await userSchema.find().where('lolNickname').in(red_team);
        const blue_team_players = await userSchema.find().where('lolNickname').in(blue_team);

        const user_blue = await userSchema.findOne({
            _id: blue_team_players[0]._id
        });
        const user_red = await userSchema.findOne({
            _id: red_team_players[0]._id
        });

        // let winRate_blue = (user_blue[0].wins / (user_blue[0].loses + user_blue[0].wins)) *100
        // winRate_blue = (Math.round(winRate * 100) / 100).toFixed(2);

        // let winRate_red = (user_red[0].wins / (user_red[0].loses + user_red[0].wins)) *100
        // winRate_red= (Math.round(winRate * 100) / 100).toFixed(2);
        let wr = 0;

        let procent_win = 20;
        let procent_lose = 20;

        let W_result, L_result = 0;
        let player_win_league = 0;
        let player_lost_league = 0;

        let blue_league = 0;
        let red_league = 0;

        if (teamWin == "blue") {
            player_win_league = blue_team_players[0].league;
            player_lost_league = red_team_players[0].league;

        } else {
            player_win_league = red_team_players[0].league;
            player_lost_league = blue_team_players[0].league;

        }

        blue_league = blue_team_players[0].league;
        red_league = red_team_players[0].league;

        let r_d = player_lost_league - player_win_league;

        W_result = Math.floor(20 + ((procent_win + r_d + wr) / 100) * procent_win);
        L_result = Math.floor(-20 + ((procent_lose + (-r_d) + wr) / 100) * procent_lose);
        console.log("a", W_result, L_result)

        if (teamWin == "blue") {
            await userSchema.updateOne({
                _id: blue_team_players[0]._id
            }, {
                $inc: {
                    wins: 1,
                    lp: W_result
                }
            });
            await userSchema.updateOne({
                _id: red_team_players[0]._id
            }, {
                $inc: {
                    loses: 1,
                    lp: L_result
                }
            });
        } else {
            await userSchema.updateOne({
                _id: blue_team_players[0]._id
            }, {
                $inc: {
                    loses: 1,
                    lp: L_result
                }
            });
            await userSchema.updateOne({
                _id: red_team_players[0]._id
            }, {
                $inc: {
                    wins: 1,
                    lp: W_result
                }
            });
        }

        current_lp_blue = await userSchema.find({
            lolNickname: blue_team[0]
        }, 'lp');

        current_lp_red = await userSchema.find({
            lolNickname: red_team[0]
        }, 'lp');


        let index = 0;
        //blue
        if (current_lp_blue[0].lp > 100) {
            index = rank_arr.findIndex(x => x == blue_league)

            await userSchema.updateOne({
                _id: blue_team_players[0]._id
            }, {
                lp: 0,
                league: constants.rank_set[index + 1]
            })
        } else if (current_lp_blue[0].lp < 0) {
            index = rank_arr.findIndex(x => x == blue_league)
            if (index == 99) {
                await userSchema.updateOne({
                    _id: blue_team_players[0]._id
                }, {
                    lp: 0,
                })
            } else {

                await userSchema.updateOne({
                    _id: blue_team_players[0]._id
                }, {
                    lp: 80,
                    league: constants.rank_set[index - 1]
                })
            }
        }

        //red
        if (current_lp_red[0].lp > 100) {
            index = rank_arr.findIndex(x => x == red_league)

            await userSchema.updateOne({
                _id: red_team_players[0]._id
            }, {
                lp: 0,
                league: constants.rank_set[index + 1]
            })
        } else if (current_lp_red[0].lp < 0) {
            index = rank_arr.findIndex(x => x == red_league)
            if (index == 99) {
                await userSchema.updateOne({
                    _id: red_team_players[0]._id
                }, {
                    lp: 0,
                })
            } else {

                await userSchema.updateOne({
                    _id: red_team_players[0]._id
                }, {
                    lp: 80,
                    league: constants.rank_set[index - 1]
                })
            }
        }

        return 1
    }
}

module.exports = MongoCmd;