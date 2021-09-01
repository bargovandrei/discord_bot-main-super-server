
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client();
const mongo = require("./utils/mongo.js");

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;

  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  mongo.init();
  await client.login(config.token);

})();

