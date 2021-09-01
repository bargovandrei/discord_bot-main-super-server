const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require("discord.js");
const ms = require("ms");
const userSchema = require("../../schemas/user");
const mongo = require('../../utils/mongo');

module.exports = class GiveawayCommand extends BaseCommand {
  constructor() {
    super('giveaway', 'mod', []);
  }

  run(client, message, args) {
    
    client.once('message', async message => {
      let prefix = "=";
      let args = message.content.substring(prefix.length).split(" ")

      // admin id
      if( message.author.id == "339854159761244161"){
      if (message.content.startsWith(`${prefix}giveaway`)) {
          let time = args[1]
          if (!time) return message.channel.send('You did not specify a time!');
  
          if (
              !args[1].endsWith("d") &&
              !args[1].endsWith("h") &&
              !args[1].endsWith("m") &&
              !args[1].endsWith("s") 
          )
              return message.channel.send('You need to use d (days), h (hours), m (minutes), or s (seconds)')
  
              let gchannel = message.mentions.channels.first();
              if (!gchannel) return message.channel.send("I can't find that channel in the server!")
  
              let prize = args.slice(3).join(" ")
              if (!prize) return message.channel.send('Arguement missing. What is the prize?')
  
              message.delete()
              gchannel.send(":tada: **NEW GIVEAWAY** :tada:")
              let gembed = new Discord.MessageEmbed()
                  .setTitle("New Giveaway!")
                  .setDescription(`React with :tada: to enter the giveaway!\nHosted By: **${message.author}**\nTime: **${time}**\nPrize: **${prize}**`)
                  .setTimestamp(Date.now + ms(args[1]))
                  .setColor(3447003)
              let n = await gchannel.send(gembed)
              n.react("🎉")
              setTimeout(async () => {
                  if(n.reactions.cache.get("🎉").count <= 1) {
                      return message.channel.send("Not enough people for me to draw a winner!")
                  }
  
                  let winner = n.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot).random();
                  gchannel.send(`Congratulations ${winner}! You just won the **${prize}**!`
                  );

                  await mongo().then(async (mongoose)=>{
                    try{
                      console.log("connected")
                      console.log(prize, winner)

                      //checks if user is registered
                      const findResult1 = await userSchema.find({
                        user: winner.username,
                      });

                      //if not user is registered
                      if(findResult1==''){
                        await new userSchema({
                          _id: winner.id,
                          guildId: message.guild.id,
                          user: winner.username,
                          credits: parseInt(prize, 10)
                        }).save()
                      }
                   
                      const findResult = await userSchema.find({
                        user: winner.username,
                      });
                     
                      await userSchema.updateOne({
                        user:winner.username
                      }, {  
                        credits: parseInt(prize, 10)+findResult[0].credits
                      })  
                      
                   }catch(e){
           
                   }finally{
                     mongoose.connection.close();
                     console.log("disconnected")
                   }
                 })

              }, ms(args[1]));
            }
          }
        })
      }
}