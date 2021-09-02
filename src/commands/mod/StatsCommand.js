const BaseCommand = require('../../utils/structures/BaseCommand');
const cmdMongo = require('./cmd')
const Discord = require('discord.js');
const constants = require('./../../utils/structures/constants')

module.exports = class StatsCommand extends BaseCommand {
  constructor() {
    super('stats', 'mod', []);
  }

  async run(client, message, args) {
    const {
      member,
      guild,
      author
    } = message;

    if(message.content!="*stats") return message.channel.send('do you mean stats?');
    const user = await cmdMongo.searchUserCommand(author.id)
    if (user.length ==0) return message.reply("You need to be registered to use this command!");
    let winRate = (user[0].wins / (user[0].loses + user[0].wins)) *100
    winRate = (Math.round(winRate * 100) / 100).toFixed(2);

    if(winRate=="NaN") {
      winRate = 0;
    }

    let stats = new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setTitle(user[0].user )
    .setTimestamp()
    .addFields({
      name: 'LolNick',
      value: user[0].lolNickname
    },{
      name: 'League',
      value: constants.ranksMap.get(user[0].league)
    },{
      name: 'Wins',
      value: user[0].wins
    }, {
      name: 'Loses',
      value: user[0].loses
    },{
      name: 'LP',
      value: user[0].lp
    }, {
      name: 'WinRate',
      value: winRate + '%'
    })
  message.channel.send(stats)
  }
}