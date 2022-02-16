module.exports = {
    name: `messageReactionAdd`,
    async execute(messageReaction, user) {
        var date = new Date();
        if (date.getFullYear() != 2022) return

        if (isMaintenance()) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (user.bot) return
        if (messageReaction.message.channel.type == "DM") return
        if (messageReaction.message.guild.id != settings.idServer) return
        if (!userstatsList) return

        var userstats = userstatsList.find(x => x.id == user.id);
        if (!userstats) return

        if (!userstats.wrapped) {
            userstats.wrapped = {
                "startTime": date.getTime(),
                "messages": {},
                "channels": {},
                "reactions": {},
                "words": {},
                "emojis": {},
                "commands": {},
                "vocalChannelsSeconds": 0,
                "startLevel": userstats.level,
                "startMoney": userstats.money ? userstats.money : 0,
            }
        }

        var dayCode = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${(date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)}`
        if (!userstats.wrapped[dayCode])
            userstats.wrapped.reactions[dayCode] = 0

        userstats.wrapped.reactions[dayCode] = userstats.wrapped.reactions[dayCode] + 1

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};