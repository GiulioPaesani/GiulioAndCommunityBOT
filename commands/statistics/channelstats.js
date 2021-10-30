module.exports = {
    name: "channelstats",
    aliases: ["channel", "channelinfo"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
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
            error(message, "Canale non trovato", "`!channelinfo (canale)`")
            return
        }

        switch (canale.type) {
            case "text": canale.type = "Text"; break;
            case "voice": canale.type = "Voice"; break;
            case "news": canale.type = "News"; break;
            case "category": canale.type = "Category"; break;
        }

        if (canale.type == "Voice") {
            let embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questo canale")
                .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                .addField(":loud_sound: Bitrate", "```" + canale.bitrate + "```", true)
                .addField(":bust_in_silhouette: User limit", canale.userLimit == 0 ? "```∞```" : "```" + canale.userLimit + "```", true)
            message.channel.send(embed)
            return
        }

        if (canale.type == "Category") {
            let embed = new Discord.MessageEmbed()
                .setTitle(canale.name)
                .setDescription("Tutte le statistiche su questa categoria")
                .addField(":receipt: Category ID", "```" + canale.id + "```", true)
                .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                .addField(":pencil: Category created", "```" + moment(canale.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
            message.channel.send(embed)
            return
        }

        const hasPermissionInChannel = canale
            .permissionsFor(message.member)
            .has('VIEW_CHANNEL', true);

        let lastMessage = canale.messages.fetch(canale.lastMessageID)
            .then(lastMessage => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                    .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                    .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                    .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : ("```" + lastMessage.author.username + "#" + lastMessage.author.discriminator + " (" + moment(new Date(lastMessage.createdTimestamp).getTime()).fromNow() + ") - " + lastMessage.content + "```"), true)
                    .addField(":pencil: Channel created", "```" + moment(canale.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
                message.channel.send(embed)
            })
            .catch(() => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(canale.name)
                    .setDescription("Tutte le statistiche su questo canale")
                    .addField(":receipt: Channel ID", "```" + canale.id + "```", true)
                    .addField(":thought_balloon: Type", "```" + canale.type + "```", true)
                    .addField(":1234: Position", "```" + canale.rawPosition + "```", true)
                    .addField(":bricks: Category", "```" + canale.parent.name + "```", true)
                    .addField(":notepad_spiral: Topic", !canale.topic ? "```No topic```" : "```" + canale.topic + "```", true)
                    .addField(":underage: NSFW", canale.nsfw ? "```Yes```" : "```No```", true)
                    .addField(":pushpin: Last message", !hasPermissionInChannel ? "```You don't have permission to view this channel```" : "```Not found```", true)
                    .addField(":pencil: Channel created", "```" + moment(canale.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(canale.createdAt).fromNow() + ")```", false)
                message.channel.send(embed)
            })
    },
};