module.exports = {
    name: `channelCreate`,
    async execute(channel) {
        if (channel.guild?.id != settings.idServer) return

        if (!channel.guild) return

        channel.permissionOverwrites.edit(settings.idRuoloNonVerificato, {
            VIEW_CHANNEL: false
        }).catch(() => { })

        channel.permissionOverwrites.edit(settings.ruoliModeration.muted, {
            SEND_MESSAGES: false
        }).catch(() => { })
        channel.permissionOverwrites.edit(settings.ruoliModeration.tempmuted, {
            SEND_MESSAGES: false
        }).catch(() => { })
        channel.permissionOverwrites.edit(settings.ruoliModeration.banned, {
            VIEW_CHANNEL: false
        }).catch(() => { })
        channel.permissionOverwrites.edit(settings.ruoliModeration.tempbanned, {
            VIEW_CHANNEL: false
        }).catch(() => { })
    },
};