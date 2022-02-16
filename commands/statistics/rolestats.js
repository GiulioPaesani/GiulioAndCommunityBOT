module.exports = {
    name: "rolestats",
    aliases: ["role", "roleinfo", "r"],
    onlyStaff: false,
    availableOnDM: false,
    description: "Visualizzare info di un ruolo",
    syntax: "!rolestats (role)",
    category: "statistics",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var ruolo = message.mentions.roles.first()
        if (!ruolo) {
            var ruolo = message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(ruolo => ruolo.name.toLowerCase() == args.join(" "))
        }

        if (!ruolo) {
            return botCommandMessage(message, "Error", "Ruolo non trovato o non valido", "Hai inserito un ruolo non valido", property)
        }

        var memberCount = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == ruolo)).size;
        var elencoPermessi = "";
        if (ruolo.permissions.has("ADMINISTRATOR"))
            elencoPermessi = "👑ADMINISTRATOR";
        else {
            var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS", "USE_SLASH_COMMANDS", "REQUEST_TO_SPEAK", "MANAGE_THREADS", "USE_PUBLIC_THREADS", "USE_PRIVATE_THREADS"]

            permissions.forEach(permesso => {
                try {

                    if (ruolo.permissions.has(permesso))
                        elencoPermessi += `- ${permesso}\r`;
                }
                catch { }
            })
        }
        if (elencoPermessi == "")
            elencoPermessi = "No permissions"

        var embed = new Discord.MessageEmbed()
            .setTitle(ruolo.name)
            .setDescription("Tutte le statistiche di questo ruolo")
            .addField(":receipt: Role ID", "```" + ruolo.id + "```", true)
            .addField(":busts_in_silhouette: Members", "```" + memberCount + "```", true)
            .addField(":rainbow: Color", "```" + ruolo.hexColor + "```", true)
            .addField(":1234: Position", "```" + ruolo.rawPosition + "```", true)
            .addField(":speech_balloon: Mentionable", ruolo.mentionable ? "```Yes```" : "```No```", true)
            .addField(":safety_pin: Separated", ruolo.hoist ? "```Yes```" : "```No```", true)
            .addField(":pencil: Role created", "```" + moment(ruolo.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(ruolo.createdAt).fromNow() + ")```", true)
            .addField(":muscle: Permissions", "```" + elencoPermessi + "```", false)

        message.channel.send({ embeds: [embed] })
    },
};