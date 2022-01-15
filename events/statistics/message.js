module.exports = {
    name: `message`,
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != settings.idServer) return
        if (!userstatsList) return

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return

        userstats.statistics.totalMessage++;

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};