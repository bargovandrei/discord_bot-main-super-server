const BaseCommand = require('../../utils/structures/BaseCommand');
const Discord = require('discord.js');
//const client = new Discord.Client();
const userSchema = require("../../schemas/user");
const mongo = require('../../utils/mongo');
const prefix = "=";

module.exports = class BlackjackCommand extends BaseCommand {
  constructor() {
    super('blackjack', 'mod', []);
  }

  async run(client, message, args) {
    // split args
     args = message.content.substring(prefix.length).split(" ")
    //get bet
    let bet_credits = args[1]
    let PLAYER_2 = args[2]
    let PLAYER_1 = message.author.id

    console.log(bet_credits, PLAYER_2, PLAYER_1)
      //create hand
      let c = [];
      c = addCard(c);
      c = addCard(c);
     
     // embeded message template
     let exampleEmbed = new Discord.MessageEmbed()
     .setColor('#0099ff')
     .setTitle('Blackjack')
     
     .setAuthor(message.member.user.username)
   
     .addFields(
       { name: 'Your hand', value: show_cards(c) },
       { name: 'Total', value: sumCard(c)},
       { name: 'Action', value: 'Hit (:thumbsup:) or stand (:thumbsdown:)?' },
     )

     //filtre
     const filter = (reaction, user) => {
      return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

     message.channel.send(exampleEmbed).then(sentMessage => {
       sentMessage.react('👍');
       sentMessage.react('👎');
       sentMessage.awaitReactions(filter, { max: 1, time: 100000, errors: ['time'] })
       .then(collected => {
         const reaction = collected.first();

         //check reaction
         if (reaction.emoji.name === '👍') {

           c = addCard(c,message)
          // TODO: maybe update last message
           exampleEmbed = create_message(c, message)
          
           
           message.channel.send(exampleEmbed).then(sentMessage => {
           sentMessage.react('👍');
           sentMessage.react('👎');

            if(check_lose(c,message))
            return

          });

         } else if (reaction.emoji.name === '👎') {
           
           if(check_lose(c,message))
              return
         }
       })
       .catch(collected => {
         message.reply('You didn\'t do anything, so now the game\'s over.');
       });
     });

    
  }
}

function addCard(user_cards){
  let card = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11,10,10,10];
  user_cards.push(card[Math.floor(Math.random()*card.length)])
  return user_cards;
}

function sumCard(user_cards ){
  let sum = 0;
  user_cards.forEach(e => {
    sum = sum+e;
  });
  return sum;
}

function show_cards(user_cards){
    const symbols = ['♣️','♥️', '♠️', '♠'];
    let text = 'Your cards are ';
    user_cards.forEach(element => {
      text = text + element + symbols[Math.floor(Math.random()*symbols.length)] + ' and '
    });
    
    return text.substring(0, text.length - 4)
}

function check_lose(user_cards,message){
  if(sumCard(user_cards)>21){
    message.reply("you lost")
    return true;
  }else{
    message.reply("you won")
    return false;
  }
}

function create_message(user_cards, message){
  let exampleEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Blackjack')
  
  .setAuthor(message.member.user.username)

  .addFields(
    { name: 'Your hand', value: show_cards(user_cards) },
    { name: 'Total', value: sumCard(user_cards)},
    { name: 'Action', value: 'Hit (:thumbsup:) or stand (:thumbsdown:)?' },
  )
  return exampleEmbed
}


//template
// const exampleEmbed = new Discord.MessageEmbed()
// 	.setColor('#0099ff')
// 	.setTitle('Pacanele')

// 	.setAuthor('Andrei Birgovan', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
// //	.setDescription('Some description here')
// //	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
// 	.addFields(
// 		{ name: 'Regular field title', value: 'Some value here' },
// 		{ name: '\u200B', value: '\u200B' },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	)
// 	.addField('Inline field title', 'Some value here', true)
// 	.setImage('https://i.imgur.com/wSTFkRM.png')
// 	.setTimestamp()
// 	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

