module.exports = {
    name: "Serverinfo",
    aliases: ["serverstats"],
    description: "Ottenere le **statistiche** del proprio server",
    category: "commands",
    id: "1639466229",
    info: "",
    video: "https://youtu.be/FNUIyrRoitg?t=146",
    v12: `
client.on("message", message => {
    if (message.content == "!serverinfo") {
        var server = message.guild;
        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", server.owner.user.username, true)
            .addField("Server id", server.id, true)
            .addField("Members", server.memberCount, false)
            .addField("Channels", server.channels.cache.size, false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + (server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send(embed)
    }
})`,
    v13: `
client.on("messageCreate", message => {
    if (message.content == "!serverinfo") {
        var server = message.guild;
        var embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", client.users.cache.get(server.ownerId).username, true)
            .addField("Server id", server.id, true)
            .addField("Members", server.memberCount.toString(), false)
            .addField("Channels", server.channels.cache.size.toString(), false)
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + (server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send({ embeds: [embed] })
    }
})
`
};
