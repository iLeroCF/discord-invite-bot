const { Client, GatewayIntentBits, Partials, Options } = require("discord.js")
const { loadCommands } = require("./handlers/commandHandler")
const { loadEvents } = require("./handlers/eventHandler")
const config = require("./config.json")
const croxydb = require("croxydb")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites
  ],
  partials: [Partials.GuildMember],
  makeCache: Options.cacheWithLimits({
    MessageManager: 0
  }),
})

client.commands = new Map()

async function start() {
  await loadCommands(client)
  await loadEvents(client)
  await client.login(config.token)
}

start()
