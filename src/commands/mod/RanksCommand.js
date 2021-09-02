const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
const cmdMongo = require('./cmd')
const prefix = "*";
const constants = require('./../../utils/structures/constants')
/*
=ranks (win)
=ranks loses 
*/
module.exports = class RanksCommand extends BaseCommand {
  constructor() {
    super('ranks', 'mod', []);
  }

  async run(client, message, args) {
    if(message.content!='=ranks' && message.content!="=ranks loses") return message.channel.send("Invalid command!")
    args = message.content.substring(prefix.length).split(" ")

    //=ranks loses for loser bracket
    let type_of_ranks = args[1];
    let players = await cmdMongo.getAllPlayers();
    let object_of_players = []

    players.forEach(element => {
      let to_push = {}
      to_push.lolNickname = element.lolNickname
      to_push.wins = element.wins
      to_push.wins = element.wins
      to_push.loses = element.loses
      to_push.lp = element.lp
      to_push.league = element.league
      object_of_players.push(to_push)

    });
    if (type_of_ranks == 'loses') {
      object_of_players.sort(function (a, b) {
        return b.loses - a.loses;
      })
      message.channel.send("___bombalai___");
      message.channel.send("Nickname" + '   ' + "Loses");
      object_of_players.forEach(element => {
        message.channel.send(element.lolNickname + '       ' + element.loses)
      });
      message.channel.send("*****************");
    } else {
     // console.log(object_of_players)
      object_of_players.sort(function (a, b) {
        return b.league - a.league || b.lp - a.lp;
      })

      message.channel.send("___Leaderboard___");
      message.channel.send("Nickname" +'    '+ "League" + '      ' + "W" +'    '+ "L"+'     '+ "LP");
      object_of_players.forEach(element => {
        
        let spaces = ' '
        if(element.lolNickname.length<15){
          let length_diff = 15-element.lolNickname.length;
          let i=0;
          for(i=0; i<length_diff;i++){
            spaces = spaces + " ";
          }
        }
        message.channel.send(element.lolNickname+spaces + constants.ranksMap.get(element.league)+'    ' + element.wins+'    '+element.loses+'   '+element.lp)
      });
      message.channel.send("_________");
    }
  }
}