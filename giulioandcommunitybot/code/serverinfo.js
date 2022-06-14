module.exports = {
    name: "Serverinfo",
    aliases: ["serverstats"],
    description: "Ottenere le **statistiche** del proprio server",
    category: "commands",
    id: "1639466229",
    link: "https://www.toptal.com/developers/hastebin/coxohiyexa.csharp",
    info: "",
    video: "https://youtu.be/FNUIyrRoitg?t=146",
    code: `
client.on("messageCreate", message => {
    if (message.content == "!serverinfo") {
        let server = message.guild;
        let embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription("Tutte le info su questo server")
            .setThumbnail(server.iconURL())
            .addField("Owner", client.users.cache.get(server.ownerId).username, true)
            .addField("Server id", server.id, true)
            .addField("Members", server.memberCount.toString())
            .addField("Channels", server.channels.cache.size.toString())
            .addField("Server created", server.createdAt.toDateString(), true)
            .addField("Boost level", "Level " + (server.premiumTier != "NONE" ? server.premiumTier : 0) + " (Boost: " + server.premiumSubscriptionCount + ")", true)
        message.channel.send({ embeds: [embed] })
    }
})`
};
