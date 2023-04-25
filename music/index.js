const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Events,
  Collection,
  AuditLogEvent,
  EmbedBuilder,
} = require("discord.js");
const config = require("./config.json");

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");
const { Player } = require("discord-player");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

client.once("ready", () => {
  console.log("ready");
  client.user.setActivity("사는 이야기", { type: ActivityType.Watching });
});

client.commands = new Collection();

module.exports = client;

client.login(config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
