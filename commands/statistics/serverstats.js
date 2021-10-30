module.exports = {
    name: "serverstats",
    aliases: ["server", "serverinfo"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        let server = message.member.guild;
        let botCount = server.members.cache.filter(member => member.user.bot).size;
        let memberCount = server.memberCount - botCount;

        let categoryCount = server.channels.cache.filter(c => c.type == "category").size;
        let textCount = server.channels.cache.filter(c => c.type == "text").size;
        let vocalCount = server.channels.cache.filter(c => c.type == "voice").size;

        let serverStats = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le statistiche su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .addField(":technologist: Owner", "```" + server.owner.user.username + "```", true)
            .addField(":map: Server region", "```" + server.region + "```", true)
            .addField(":green_circle: Online users", "```" + server.members.cache.filter(user => user.presence.status != "offline").size + "```", true)
            .addField(":placard: Server ID", "```" + server.id + "```", true)
            .addField(":beginner: Boost level", "```Level " + server.premiumTier + " (" + server.premiumSubscriptionCount + " boost)```", true)
            .addField(":busts_in_silhouette: Members", "```Total: " + server.memberCount + " | Members: " + memberCount + " | Bots: " + botCount + "```", false)
            .addField(":loud_sound: Server categories and channels", "```Category: " + categoryCount + " | Text: " + textCount + " | Voice: " + vocalCount + "```", false)
            .addField(":calendar_spiral: Server created", "```" + moment(server.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(server.createdAt).fromNow() + ")```", false)

        message.channel.send(serverStats)
    },
};