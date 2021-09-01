const BaseCommand = require('../../utils/structures/BaseCommand');
const cmdMongo = require('./cmd')
const prefix = "=";

module.exports = class RegwinCommand extends BaseCommand {
  constructor() {
    super('rw', 'mod', []);
  }

  async run(client, message, args) {
    args = message.content.substring(prefix.length).split(" ")
    const {
      member,
      guild,
      author
    } = message;
    let game_id = args[1];
    let team_win = args[2];

    if (!message.member.roles.cache.find(r => r.name === "SuperServerMod"))  return message.channel.send('You can`t do that!');
    // if (author.id !== "339854159761244161" && author.id !== "489335161297829890") return message.channel.send('You can`t do that!');

    if (!game_id) return message.channel.send('Game_id not specified!');
    if (!team_win) return message.channel.send('Winning team not specified');
    if (team_win != "blue" && team_win != "red") return message.channel.send('Wrong name for team! (red/blue)');
    let game = await cmdMongo.searchGame(game_id);
    if (game.length == 0) return message.channel.send('Game_id not found');
    if (game[0].win == 'blue' || game[0].win == 'red') return message.channel.send('Game already updated');

    //update game_id in db - add win to team
    await cmdMongo.updateGame(game_id, team_win)

    //update players que status to 0
    let players_to_update_que_status = [];
    let blue_team = []
    let red_team = []

    players_to_update_que_status.push(game[0].participants.blue[0])
    blue_team.push(game[0].participants.blue[0])

    players_to_update_que_status.push(game[0].participants.red[0])
    red_team.push(game[0].participants.red[0])

    await cmdMongo.updatePlayersQue(players_to_update_que_status, 0);

    //console.log(blue_team,red_team )

    //score update
    let status = await cmdMongo.updatePlayersScore(red_team, blue_team, team_win);
    if (status == 1) return message.channel.send("Stats updated!")
  }
}