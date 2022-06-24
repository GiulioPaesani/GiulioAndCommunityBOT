const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getServer } = require("../../functions/database/getServer")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { updateUser } = require("../../functions/database/updateUser")
const { updateServer } = require("../../functions/database/updateServer")

module.exports = {
    name: "messageDelete",
    async execute(client, message) {
        if (!message.author) return

        if (isMaintenance(message.author.id)) return

        if (message.channel.id != settings.idCanaliServer.onewordstory) return

        let serverstats = await getServer()

        if (!serverstats.onewordstory.words.find(x => x.message == message.id)) return

        serverstats.onewordstory.words = serverstats.onewordstory.words.filter(x => x.message != message.id)
        serverstats.onewordstory.totWords--
        serverstats.onewordstory.totWordsToday--
        serverstats.onewordstory.lastMessage = serverstats.onewordstory[serverstats.onewordstory.length - 1]?.message || null

        updateServer(serverstats)

        let userstats = await getUser(message.author.id)
        if (!userstats) userstats = await addUser(message.member)

        userstats.onewordstory.totWords--
        userstats.onewordstory.totWordsToday--

        updateUser(userstats)
    },
};
