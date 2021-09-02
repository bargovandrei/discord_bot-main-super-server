const BaseCommand = require('../../utils/structures/BaseCommand');
const cmdMongo = require('./cmd')
const Discord = require('discord.js');
const prefix = "*";

module.exports = class HistoryCommand extends BaseCommand {
  constructor() {
    super('history', 'mod', []);
  }

  async run(client, message, args) {
    const {
      member,
      guild,
      author
    } = message;
    let embed = new Discord.MessageEmbed()
    args = message.content.substring(prefix.length).split(" ")
    let numberOfGamesToShow = args[1]
    if (numberOfGamesToShow <= 4) return message.reply("Default its 5!");
    if (numberOfGamesToShow > 10) return message.reply("Da cam multe vrei sa vezi!");

    let user_playing = author.id;
    const player = await cmdMongo.searchUserCommand(user_playing);

    let history = await cmdMongo.searchGameByPlayer(player)

    let slicedArray = [];

    if (!numberOfGamesToShow) {
      slicedArray = history.slice(1).slice(-5);
    } else {
      slicedArray = history.slice(1).slice(parseInt(-numberOfGamesToShow));
    }

    slicedArray.forEach(element => {

      if (element.win == '0') {
        embed.addField("GameID" + element._id, element.participants.blue[0] + " vs " + element.participants.red[0] + " - " + "gameInProgress")
      } else if (element.participants.red[0] == player[0].lolNickname) {
        if (element.win == 'red') {
          embed.addField("GameID" + element._id, element.participants.blue[0] + " vs " + element.participants.red[0] + " - " + "win")
        } else {
          embed.addField("GameID" + element._id, element.participants.blue[0] + " vs " + element.participants.red[0] + " - " + "lost")
        }
      } else if (element.participants.blue[0] == player[0].lolNickname) {
        if (element.win == 'blue') {
          embed.addField("GameID" + element._id, element.participants.blue[0] + " vs " + element.participants.red[0] + " - " + "win")
        } else {
          embed.addField("GameID" + element._id, element.participants.blue[0] + " vs " + element.participants.red[0] + " - " + "lost")
        }
      }

    });

    message.channel.send(embed)

  }
}