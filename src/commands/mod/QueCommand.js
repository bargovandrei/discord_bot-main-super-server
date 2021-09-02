const BaseCommand = require('../../utils/structures/BaseCommand');
const userSchema = require("../../schemas/user");
const gamesSchema = require("../../schemas/games");
const mongo = require('../../utils/mongo');
const cmdMongo = require('./cmd')
const constants = require('./../../utils/structures/constants')

/*
=que - enter que
=que 0 - out of que
*/

const {
  GuildMember
} = require('discord.js');

const Discord = require('discord.js');
const user = require('../../schemas/user');
const prefix = "*";
cmdMongo.setURL("mongodb+srv://andreiB:336529Ab.@cluster0.2nx6d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

module.exports = class QueCommand extends BaseCommand {
  constructor() {
    super('que', 'mod', []);
  }

  async run(client, message, args) {
    args = message.content.substring(prefix.length).split(" ")
    let argument = args[1];

    const {
      member,
      guild,
      author
    } = message;
    let searchgame = 0;
   
    let user_playing = author.id;
    const player = await cmdMongo.searchUserCommand(user_playing);
    if (player.length ==0) return message.reply("You need to be registered to use this command!");
    
    if (argument == 'cancel') {

      if (player[0].inQue == 0) {
        message.channel.send("You are already out from que!")
        return
      } else {
        await cmdMongo.updateQueStatus(player, 0);

        message.channel.send("La revedere!")
        return
      }

    }
    if(parseInt(argument)>10 || parseInt(argument)<2 ||argument==undefined){
      argument = 2;
    }
    if(argument!== null){
      message.channel.send("Que length: " + argument)
    }

   // if (message.content !== "=que") return message.reply("Wrong command, try: =que!");
    if (player !== []) {

      if (player[0].inQue == 2) {
        message.channel.send(message.author.username + " you can`t join in que while you are in a game!")
      } else if (player[0].inQue !== 1) {
        await userSchema.updateOne({
          _id: user_playing
        }, {
          inQue: 1
        })
        message.reply(message.author.username + " in que!")
        searchgame = 1;
      } else {
        message.reply(" you are already in que!")
        searchgame = 1;
      }
      if (searchgame == 0) return
      let players_to_be_matched = await cmdMongo.searchUserinQue();

      //change for how many players to wait 

      if (players_to_be_matched.length < argument) return message.channel.send("Nu sunt destui jucatori in que!")
      let players_avaible = 1;

      let p1 = [];
      players_to_be_matched.forEach(element => {
        p1.push(element.lolNickname)
      });

      while (players_avaible == 1) {
        let players_in_game = makeGame(p1);
        players_avaible = 0;
        p1 = p1.filter(el => !players_in_game.includes(el));

        if (p1.length >= 2) {
          players_avaible = 1;
        }
        //create game in db only when game was created
        let game = {};
        if (players_in_game !== undefined) {
          game = await cmdMongo.createGame(players_in_game);

        }
        makeMessage(players_in_game, game._id)
        await cmdMongo.updatePlayersQue(players_in_game, 2);
      }
    } else {
      message.reply("You have to be registered to use this command!");
    }

    //make message for disccord chat
    async function makeMessage(users, game_nr) {
      console.log(users)
      const blue_team_players = await userSchema.find().where('lolNickname').in(users[0]);
      const red_team_players = await userSchema.find().where('lolNickname').in(users[1]);

      let blue_league = blue_team_players[0].league;
      let red_league = red_team_players[0].league;

      let exampleEmbed2 = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle("GameID " + game_nr)
        .setAuthor("1v1")
        .setTimestamp()
        .addFields({
          name: 'Blue team - SA FACI ROOM PROSTULE',
          value: users[0] +" - "+ constants.ranksMap.get(blue_league)
        }, {
          name: 'Red team',
          value: users[1] +" - "+ constants.ranksMap.get(red_league)
        }, )
      message.channel.send(exampleEmbed2)
    }

    //create game room
    function makeGame(users) {
      //games of 1-1
      let players_to_match = users

      let game_to_go = []
      let random = Math.floor(Math.random() * players_to_match.length);
      //adaug primul player
      game_to_go.push(players_to_match[random])
      //scot playerul din matchmaking
      players_to_match.splice(random, 1);
      //verific daca mai e doar unul il adaug pe acela

      if (players_to_match.length == 1) {
        game_to_go.push(players_to_match[0])
        //scot playerul din matchmaking
        players_to_match.splice(0, 1);
        //trimit mesaj cu meciul
        return game_to_go;

      } else {
        //mai adaug un player random din playerii ramasi
        random = Math.floor(Math.random() * players_to_match.length);
        game_to_go.push(players_to_match[random])
        //scot playerul din matchmaking

        players_to_match.splice(random, 1);
        //trimit mesaj cu meciul

        return game_to_go;
      }

    }
  }
}