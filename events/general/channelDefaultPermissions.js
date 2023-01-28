const settings = require("../../config/general/settings.json")

module.exports = {
    name: `channelCreate`,
    async execute(client, channel) {
        if (channel.guild?.id != settings.idServer) return

        channel.permissionOverwrites?.edit(settings.ruoliModeration.muted, {
            SEND_MESSAGES: false,
            SEND_MESSAGES_IN_THREADS: false,
            ADD_REACTIONS: false,
            SPEAK: false,
            STREAM: false,
        })
        channel.permissionOverwrites?.edit(settings.ruoliModeration.tempmuted, {
            SEND_MESSAGES: false,
            SEND_MESSAGES_IN_THREADS: false,
            ADD_REACTIONS: false,
            SPEAK: false,
            STREAM: false,
        })

        channel.permissionOverwrites?.edit(settings.ruoliModeration.banned, {
            VIEW_CHANNEL: false
        })
        channel.permissionOverwrites?.edit(settings.ruoliModeration.tempbanned, {
            VIEW_CHANNEL: false
        })
    },
};