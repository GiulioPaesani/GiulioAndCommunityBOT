const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { checkBadwords } = require("../../../functions/moderation/checkBadwords");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return
        if (message.channel.type == "DM") return

        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (trovata && !getUserPermissionLevel(client, message.author.id) && !message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        let serverstats = await getServer()
        let room = serverstats.privateRooms.find(x => x.channel == message.channel.id)
        if (!room) return

        if (room.owners.includes(message.author.id) && getUserPermissionLevel(client, message.author.id)) return

        let messageContent = message.content

        //Emojis
        if ((messageContent.match(/<:.+?:.+?\d+>/g) || messageContent.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)) && !room.mode.emoji) return message.delete().catch(() => { })

        messageContent = messageContent.replace(/<:.+?:.+?\d+>/g, "").replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, "")

        //Gif
        if ((messageContent.includes("https://tenor.com/view/") || message.attachments.find(x => x.contentType.endsWith("gif"))) && !room.mode.gif) return message.delete().catch(() => { })

        messageContent.split(/ /g).filter(x => x.includes("https://tenor.com/view/")).forEach(gif => {
            messageContent = messageContent.replace(gif, ``).trim()
        });

        //Messages
        if (messageContent && !room.mode.messages) return message.delete().catch(() => { })

        //Image
        if (message.attachments.find(x => x.contentType.startsWith("image") && !x.contentType.endsWith("gif")) && !room.mode.image) return message.delete().catch(() => { })

        //Video
        if (message.attachments.find(x => x.contentType.startsWith("video")) && !room.mode.video) return message.delete().catch(() => { })

        //File
        if (message.attachments.find(x => !x.contentType.startsWith("video") && !x.contentType.startsWith("image")) && !room.mode.file) return message.delete().catch(() => { })

        //Sticker
        if (message.stickers.size > 0 && !room.mode.sticker) return message.delete().catch(() => { })
    }
}