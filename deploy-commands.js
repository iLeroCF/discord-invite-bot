const fs = require("fs")
const path = require("path")
const { REST, Routes } = require("discord.js")
const config = require("./config.json")

const commands = []
const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"))

for (const file of files) {
  const cmd = require(`./commands/${file}`)
  commands.push(cmd.data.toJSON())
}

const rest = new REST({ version: "10" }).setToken(config.token)

async function deploy() {
  if (config.guildId) {
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    )
  } else {
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    )
  }
}

deploy()
