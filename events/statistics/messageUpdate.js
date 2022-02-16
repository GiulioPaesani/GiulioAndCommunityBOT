module.exports = {
    name: "messageUpdate",
    async execute(oldMessage, newMessage) {
        if (!newMessage) return
        if (!newMessage.author) return

        if (isMaintenance(newMessage.author.id)) return

        if (newMessage.author.bot) return
        if (newMessage.channel.type == "DM") return
        if (newMessage.guild.id != settings.idServer) return
        if (!userstatsList) return

        var userstats = userstatsList.find(x => x.id == newMessage.author.id);
        if (!userstats) return

        userstats.statistics.editMessage++;

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};