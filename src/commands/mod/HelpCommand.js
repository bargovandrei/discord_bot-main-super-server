const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class HelpCommand extends BaseCommand {
  constructor() {
    super('help', 'mod', []);
  }

  run(client, message, args) {
    message.channel.send("=regwin game_id blue/red ****** =que ***** =reqister");
  }
}