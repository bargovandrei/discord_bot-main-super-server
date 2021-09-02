const BaseCommand = require('../../utils/structures/BaseCommand');
const userSchema = require("../../schemas/user");
const mongo = require('../../utils/mongo');
const prefix = "*";
const cmdMongo = require('./cmd')

module.exports = class RegisterCommand extends BaseCommand {
  constructor() {
    super('register', 'mod', []);
  }

  async run(client, message, args) {
    args = message.content.substring(prefix.length).split(" ")
    const {
      member,
      guild,
      author
    } = message;

    let lolNickname = args[1];

    // check if user is registerd
    const user = await cmdMongo.searchUserCommand(author.id)
    if (user.length !==0) return message.reply("You are already registered!");

    //check if lolNickname specified
    if (!lolNickname) return message.channel.send("You did not specify your lol nickname!");

    //add user
    cmdMongo.createUser(author, guild, lolNickname);
    message.channel.send(message.author.username + " just registered!");

  }
}