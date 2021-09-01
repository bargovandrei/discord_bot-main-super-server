const BaseCommand = require('../../utils/structures/BaseCommand');
const cmdMongo = require('./cmd')

module.exports = class DeleteCommand extends BaseCommand {
  constructor() {
    super('delete', 'mod', []);
  }

  async run(client, message, args) {
    const {
      member,
      guild,
      author
    } = message;
    
    if (author.id !== "339854159761244161") return message.channel.send('You can`t do that!');
    console.log(await cmdMongo.delete())
  }
}