const BaseCommand = require('../../utils/structures/BaseCommand');
const userSchema = require("../../schemas/user");
const mongo = require('../../utils/mongo');
const { GuildMember } = require('discord.js');

module.exports = class DoubleCommand extends BaseCommand {
  constructor() {
    super('double', 'mod', []);
  }

  async run(client, message, args) {
      
      let prefix = "=";
      args = message.content.substring(prefix.length).split(" ")
    
      if (message.content.startsWith(`${prefix}double`)) {
          let double_double = args[1]
          console.log(double_double)
          if (!double_double) return message.channel.send('YOu need to choose 1 or 2')
          let bet = args[2] 
          if (!bet) return message.channel.send('You need to place your bet! ex: double [1/2] [bet]');
          let user_playing = message.author;
          let user_credits = 0;

          await mongo().then(async (mongoose)=>{
            try{
              console.log("connected")

              const findResult1 = await userSchema.find({
                user: user_playing.username,
              });

              if(findResult1==''){
                console.log("user nou");
                await new userSchema({
                  _id: user_playing.id,
                  guildId: message.guild.id,
                  user: user_playing.username,
                  credits: parseInt(prize, 10)
                }).save()
                message.channel.send(message.author.username + " Just registered!")
              }
              user_credits = findResult1[0].credits;

            }catch(e){
      
            }finally{
              mongoose.connection.close();
              console.log("disconnected")
           
            }
          })

          if (user_credits<bet) return message.channel.send('Not enough credits!');

          function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
          }
          let outcome = Math.floor(getRandomArbitrary(1,3));
          let credits = 0;

          if(outcome == parseInt(double_double, 10)){
          
            
            await mongo().then(async (mongoose)=>{
              try{
                   const findResult = await userSchema.find({
                    user: user_playing.username,
                  });
                 
                  await userSchema.updateOne({
                    user:user_playing.username
                  }, {  
                    credits: findResult[0].credits + parseInt(bet, 10)
                  })  
                  credits = findResult[0].credits + parseInt(bet, 10);
                }catch(e){
           
                }finally{
                  mongoose.connection.close();
                  console.log("disconnected")
                }
              })

              message.channel.send(outcome + " You won! " + " YOU HAVE " + credits + " credits!");

          }else{
            
            await mongo().then(async (mongoose)=>{
              try{
                   const findResult = await userSchema.find({
                    user: user_playing.username,
                  });
                 
                  await userSchema.updateOne({
                    user:user_playing.username
                  }, {  
                    credits: findResult[0].credits - parseInt(bet, 10)
                  })  
                 credits = findResult[0].credits - parseInt(bet, 10);
                }catch(e){
           
                }finally{
                  mongoose.connection.close();
                  console.log("disconnected")
                }
              })
              message.channel.send(outcome + " You lost! "+ "Credite ramase " + credits);
          }      
      }
  }
}