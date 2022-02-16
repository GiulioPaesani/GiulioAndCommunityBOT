module.exports = {
    name: "channelstats",
    aliases: ["channel", "channelinfo", "c"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Visualizzare info di un canale",
    syntax: "!channelstats (channel)",
    category: "statistics",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
            if (!canale) {
                var canale = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(canale => canale.name.toLowerCase() == args.join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(2).toLowerCase() == args.join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(3).toLowerCase() == args.join(" "))
            }
        }

        if (!canale) {
            return botCommandMessage(message, "Error", "Canale non trovato o non valido", "Hai inserito un canale non valido", property)
        }

        switch (canale.type) {
            case "GUILD_TEXT": canale.type = "Text"; break;
            case "GUILD_VOICE": canale.type = "GUILD_VOICE"; break;
            case "news": canale.type = "News"; break;
            case "GUILD_CATEGORY": canale.type = "Category"; break;
        }

        if (canale.type == "GUILD_VOICE") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questo canale")
                .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                .addField(":loud_sound: Bitrate", "```" + canale.bitrate + "```", true)
                .addField(":bust_in_silhouette: User limit", canale.userLimit == 0 ? "```∞```" : "```" + canale.userLimit + "```", true)
            message.channel.send({ embeds: [embed] })
            return
        }

        if (canale.type == "Category") {
            var embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questa categoria")
                .addField(":receipt: Category ID", "```" + canale.id + "```", true)
                .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                .addField(":pencil: Category created", "```" + moment(canale.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
            message.channel.send({ embeds: [embed] })
            return
        }

        const hasPermissionInChannel = canale
            .permissionsFor(message.member)
            .has('VIEW_CHANNEL', true);

        var lastMessage = canale.messages.fetch(canale.lastMessageID)
            .then(lastMessage => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                    .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                    .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                    .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : ("```" + lastMessage.author.username + "#" + lastMessage.author.discriminator + " (" + moment(new Date(lastMessage.createdTimestamp).getTime()).fromNow() + ") - " + lastMessage.content + "```"), true)
                    .addField(":pencil: Channel created", "```" + moment(canale.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
                message.channel.send({ embeds: [embed] })
            })
            .catch(() => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                    .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                    .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                    .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : "```Not found```", true)
                    .addField(":pencil: Channel created", "```" + moment(canale.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
                message.channel.send({ embeds: [embed] })
            })
    },
};