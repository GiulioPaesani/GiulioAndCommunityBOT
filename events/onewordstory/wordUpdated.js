const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getServer } = require("../../functions/database/getServer")
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "messageUpdate",
    async execute(client, oldMessage, newMessage) {
        if (!oldMessage) return
        if (!oldMessage.author) return

        const maintenanceStates = await isMaintenance(oldMessage.author.id)
        if (maintenanceStates) return

        if (oldMessage.channel?.id != settings.idCanaliServer.onewordstory) return

        let serverstats = await getServer()

        if (!serverstats.onewordstory.words[serverstats.onewordstory.words.findIndex(x => x.message == newMessage.id)]) return

        serverstats.onewordstory.words[serverstats.onewordstory.words.findIndex(x => x.message == newMessage.id)].word = newMessage.content

        updateServer(serverstats)
    },
};