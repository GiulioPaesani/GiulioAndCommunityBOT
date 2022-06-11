const Discord = require("discord.js")
const Parser = require('expr-eval').Parser;
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { getServer } = require("../../functions/database/getServer")
const { updateUser } = require("../../functions/database/updateUser");
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "messageUpdate",
    client: "fun",
    async execute(client, oldMessage, newMessage) {
        if (!oldMessage) return
        if (!oldMessage.author) return

        if (isMaintenance(oldMessage.author.id)) return

        if (oldMessage.channel.id != settings.idCanaliServer.onewordstory) return

        let serverstats = getServer()

        serverstats.onewordstory.words[serverstats.onewordstory.words.findIndex(x => x.message == newMessage.id)].word = newMessage.content

        updateServer(serverstats)
    },
};