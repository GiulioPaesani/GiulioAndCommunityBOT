module.exports = {
    name: "serverinfo",
    aliases: ["serverstats"],
    description: "Ottenere le **statistiche** del proprio server",
    info: "",
    video: "https://youtu.be/FNUIyrRoitg?t=146",
    code: `
client.on("message", message => {
    if (message.content == "!serverinfo") {
        var server = message.member.guild;
        var botCount = server.members.cache.filter(member => member.user.bot).size;
        var utentiCount = server.memberCount - botCount;
        var categoryCount = server.channels.cache.filter(c => c.type == "category").size
        var textCount = server.channels.cache.filter(c => c.type == "text").size
        var voiceCount = server.channels.cache.filter(c => c.type == "voice").size
        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", server.owner.user.username, true)
            .addField("Server id", server.id, true)
            .addField("Server region", server.region, true)
            .addField("Members", "Total: " + server.memberCount + " - Users: " + utentiCount + " - Bots: " + botCount, false)
            .addField("Channels", "Category: " + categoryCount + " - Text: " + textCount + " - Voice: " + voiceCount, false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + server.premiumTier + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send(embed)
    }
})`
};
