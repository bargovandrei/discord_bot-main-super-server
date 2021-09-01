const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'testing', []);
  }

  async run(client, message, args) {
    message.channel.send('Sugi pula Vali');

  //   if(teamWin=="blue"){
  //     await userSchema.updateOne( { _id: blue_team_players[0]._id },{ $inc: { wins: 1, lp: W_result }});
  //     await userSchema.updateOne( { _id: red_team_players[0]._id },{ $inc: { loses: 1, lp: L_result }});
  // }
  // else{
  //     await userSchema.updateOne( { _id: blue_team_players[0]._id },{ $inc: {  loses: 1, lp: L_result }});
  //     await userSchema.updateOne( { _id: red_team_players[0]._id },{ $inc: { wins: 1,  lp: W_result  }});
  // }

  }
}