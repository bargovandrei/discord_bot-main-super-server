let ranksMap = new Map();
let rank_set = [-11,-9,-6,-3,1,2,3,4,10,11,12,13,14,15,16,17,20,22,24,26,30,34,38,42];

ranksMap.set(-11, "IRON IV");
ranksMap.set(-9, "IRON III");
ranksMap.set(-6, "IRON II");
ranksMap.set(-3, "IRON I");

ranksMap.set(1, "Bronze IV");
ranksMap.set(2, "Bronze III");
ranksMap.set(3, "Bronze II");
ranksMap.set(4, "Bronze I");

ranksMap.set(10, "Silver IV");
ranksMap.set(11, "Silver III");
ranksMap.set(12, "Silver II");
ranksMap.set(13, "Silver I");

ranksMap.set(14, "Gold IV");
ranksMap.set(15, "Gold III");
ranksMap.set(16, "Gold II");
ranksMap.set(17, "Gold I");

ranksMap.set(20, "Platinum IV");
ranksMap.set(22, "Platinum III");
ranksMap.set(24, "Platinum II");
ranksMap.set(26, "Platinum I");

ranksMap.set(30, "Diamond IV");
ranksMap.set(34, "Diamond III");
ranksMap.set(38, "Diamond II");
ranksMap.set(42, "Diamond I");

module.exports = {ranksMap, rank_set};