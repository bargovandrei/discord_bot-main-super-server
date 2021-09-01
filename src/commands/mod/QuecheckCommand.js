const BaseCommand = require('../../utils/structures/BaseCommand');
const cmdMongo = require('./cmd')
const prefix = "=";


module.exports = class QuecheckCommand extends BaseCommand {
  constructor() {
    super('quecheck', 'mod', []);
  }

  async run(client, message, args) {
    const {
      member,
      guild,
      author
    } = message;
    let players_que = await cmdMongo.searchPlayersInQue();

    message.channel.send("Currently players in que: " +players_que.length+ ".")
  }
}