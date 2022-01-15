module.exports = {
    name: `channelCreate`,
    async execute(channel) {
        if (channel.guild?.id != settings.idServer) return

        if (!channel.guild) return

        channel.updateOverwrite(settings.idRuoloNonVerificato, {
            VIEW_CHANNEL: false
        }).catch(() => { return })

        channel.updateOverwrite(settings.ruoliModeration.muted, {
            SEND_MESSAGES: false
        }).catch(() => { return })
        channel.updateOverwrite(settings.ruoliModeration.tempmuted, {
            SEND_MESSAGES: false
        }).catch(() => { return })
        channel.updateOverwrite(settings.ruoliModeration.banned, {
            VIEW_CHANNEL: false
        }).catch(() => { return })
        channel.updateOverwrite(settings.ruoliModeration.tempbanned, {
            VIEW_CHANNEL: false
        }).catch(() => { return })
    },
};