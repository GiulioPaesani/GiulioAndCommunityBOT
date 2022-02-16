module.exports = {
    name: `messageReactionAdd`,
    async execute(messageReaction, user) {
        if (isMaintenance(user.id)) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if (user.bot) return
        if (messageReaction.message.channel.type == "DM") return
        if (messageReaction.message.guild.id != settings.idServer) return
        if (!userstatsList) return

        var userstats = userstatsList.find(x => x.id == user.id);
        if (!userstats) return

        userstats.statistics.addReaction++;

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};