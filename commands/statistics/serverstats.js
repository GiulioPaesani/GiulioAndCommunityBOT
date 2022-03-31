module.exports = {
    name: "serverstats",
    aliases: ["server", "serverinfo", "s"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare info sul server",
    syntax: "!serverstats",
    category: "statistics",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var server = client.guilds.cache.get(settings.idServer);
        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var memberCount = server.memberCount - botCount;

        var categoryCount = server.channels.cache.filter(c => c.type == "GUILD_CATEGORY").size;
        var textCount = server.channels.cache.filter(c => c.type == "GUILD_TEXT").size;
        var vocalCount = server.channels.cache.filter(c => c.type == "GUILD_VOICE").size;

        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le statistiche su questo server")
            .setThumbnail(server.iconURL({ dynamic: true }))
            .addField(":green_circle: Online users", "```" + server.members.cache.filter(user => !user?.presence?.status || user.presence.status != "offline").size + "```", true)
            .addField(":placard: Server ID", "```" + server.id + "```", true)
            .addField(":beginner: Boost level", "```Level " + server.premiumTier + " (" + server.premiumSubscriptionCount + " boost)```", true)
            .addField(":busts_in_silhouette: Members", "```Total: " + server.memberCount + " | Members: " + memberCount + " | Bots: " + botCount + "```", false)
            .addField(":loud_sound: Server categories and channels", "```Category: " + categoryCount + " | Text: " + textCount + " | Voice: " + vocalCount + "```", false)
            .addField(":calendar_spiral: Server created", "```" + moment(server.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(server.createdAt).fromNow() + ")```", false)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};