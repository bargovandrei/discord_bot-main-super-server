const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js");
const mongo = require('../../utils/mongo');
const userSchema = require("../../schemas/user");

module.exports = class CreditsCommand extends BaseCommand {
  constructor() {
    super('credits', 'mod', []);
  }
  async run(client, message, args) {
    await mongo().then(async (mongoose)=>{
      try{
        console.log(message.author.username)

          const findResult1 = await userSchema.find({
            user: message.author.username,
          });

          if(findResult1==''){
            message.reply("You have to be registered to use this command -> use {prefix}register");
          }
        
        const findResult = await userSchema.find({
          user: message.author.username,
        });
        message.reply("You have " + findResult[0].credits + " credits!")
      }catch(e){

      }finally{
        mongoose.connection.close();
        console.log("disconnected")
      }
    })
  }
}