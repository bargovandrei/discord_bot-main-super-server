const BaseCommand = require('../../utils/structures/BaseCommand');
const constants = require('./../../utils/structures/constants')
const cmdMongo = require('./cmd')

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('test', 'mod', []);
  }

  async run(client, message, args) {
    const {
      member,
      guild,
      author
    } = message;

    const user = await cmdMongo.searchUserCommand("228856525559562240")
    let winRate = (user[0].wins / (user[0].loses + user[0].wins)) *100
    winRate = (Math.round(winRate * 100) / 100).toFixed(2);
    console.log("winRate", winRate);

    let wr = 0.6;
    let rd_slab = 5;
    let rd_bun = -rd_slab;
    let p_w, p_l = 20;
    p_w = 20;
    p_l = 20;
    let W_result, l_result = 0
    let test_W_result, test_l_result = 0;

    let player_win = "";
    let player_win_league = 17
    let player_lost = "";
    let player_lost_league = 3;

    let r_d = player_lost_league - player_win_league;

    test_W_result = 20 + ((p_w + r_d + wr) / 100) * p_w;
    test_l_result = -20 + ((p_l + (-r_d) + wr) / 100) * p_l;

    console.log("test W:" +  Math.floor(test_W_result))
    console.log("test L:" +Math.floor (test_l_result))

    // default values
    W_result = 20 + ((p_w + rd_slab + wr) / 100) * p_w
    l_result = -20 + ((p_l + rd_slab + wr) / 100) * p_l

    console.log("ala slab W_result:" + W_result)
    console.log("ala slab l_result:" + l_result)

    W_result = 20 + ((p_w + rd_bun + wr) / 100) * p_w
    l_result = -20 + ((p_l + rd_bun + wr) / 100) * p_l

    console.log("ala bun W_result:" + W_result)
    console.log("ala bun l_result:" + l_result)


    // let ranksMap = new Map();
    // ranksMap.set(0, "Bronze_1");
    // ranksMap.set(1, "Bronze_2");
    // ranksMap.set(3, "Bronze_3");


    console.log(constants.ranksMap.get(1));
  }
}