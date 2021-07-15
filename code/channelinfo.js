module.exports = {
    name: "channelinfo",
    aliases: ["channelstats"],
    description: "Ottenere le **statistiche** di un canale",
    info: "",
    video: "",
    code: `
client.on("message", message => {
    if (message.content.startsWith("!channelinfo")) {
        if (message.content == "!channelinfo") {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
        }
        if (!canale) {
            message.channel.send("Canale non trovato");
            return
        }
        switch (canale.type) {
            case "text": canale.type = "Text"; break;
            case "voice": canale.type = "Voice"; break;
            case "news": canale.type = "News"; break;
            case "category": canale.type = "Category"; break;
        }
        if (canale.type == "Voice") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questo canale")
                .addField("Channel ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition, true)
                .addField("Category", canale.parent.name, true)
                .addField("Bitrate", canale.bitrate, true)
                .addField("User limit", canale.userLimit == 0 ? "∞" : canale.userLimit, true)
            message.channel.send(embed)
            return
        }
        if (canale.type == "Category") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questa categoria")
                .addField("Category ID", canale.id, true)
                .addField("Type", canale.type, true)
                .addField("Position", canale.rawPosition, true)
                .addField("Category created", canale.createdAt.toDateString(), false)
            message.channel.send(embed)
            return
        }
        var lastMessage = canale.messages.fetch(canale.lastMessageID)
            .then(lastMessage => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField("Channel ID", canale.id, true)
                    .addField("Type", canale.type, true)
                    .addField("Position", canale.rawPosition, true)
                    .addField("Category", canale.parent.name, true)
                    .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
                    .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
                    .addField("Last message", lastMessage.author.username + "#" + lastMessage.author.discriminator + " - " + lastMessage.content, true)
                    .addField("Channel created", canale.createdAt.toDateString(), false)
                message.channel.send(embed)
            })
            .catch(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField("Channel ID", canale.id, true)
                    .addField("Type", canale.type, true)
                    .addField("Position", canale.rawPosition, true)
                    .addField("Category", canale.parent.name, true)
                    .addField("Topic", !canale.topic ? "No topic" : canale.topic, true)
                    .addField("NSFW", canale.nsfw ? "Yes" : "No", true)
                    .addField("Last message", "Not found", true)
                    .addField("Channel created", canale.createdAt.toDateString(), false)
                message.channel.send(embed)
            });
    }
})`
};
