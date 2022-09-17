const Discord = require("discord.js")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const colors = require("../../config/general/colors.json")
const settings = require("../../config/general/settings.json")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {

        if (message.channel.parentId != settings.idCanaliServer.help && message.channel.parentId != settings.idCanaliServer.categoriaCommunity) return

        if (message.type == "CHANNEL_PINNED_MESSAGE") message.delete()
    }
}
