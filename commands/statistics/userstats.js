module.exports = {
    name: "userstats",
    aliases: ["user", "userinfo", "u"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare info su un utente",
    syntax: "!userstats (user)",
    category: "statistics",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == message.author.id);
        }
        else {
            var utente = message.mentions.users?.first()
            if (!utente) {
                var utente = await getUser(args.join(" "))
            }
            utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == utente?.id);
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var elencoRuoli = "";
        utente._roles.sort((a, b) => (client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.id == a).rawPosition < client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.id == b).rawPosition) ? 1 : ((client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.id == b).rawPosition < client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.id == a).rawPosition) ? -1 : 0)).forEach(idRuolo => elencoRuoli += `- ${client.guilds.cache.get(settings.idServer).roles.cache.get(idRuolo).name}\r`);

        if (elencoRuoli == "")
            elencoRuoli = "Nessun ruolo";

        var status = utente.presence?.status;
        switch (status) {
            case "online": status = "Online"; break;
            case "offline": status = "Offline"; break;
            case "dnd": status = "Do not disturb"; break;
            case "idle": status = "Idle"; break;
        }

        const badge = await utente.user.flags
        const userFlags = badge.toArray()
        const elencoBadge = userFlags.length ? userFlags.map(flag => flag).join(" ") : 'Nessun badge'

        var embed = new Discord.MessageEmbed()
            .setTitle("Userstats - " + (utente.nickname ? utente.nickname : utente.user.username))
            .setDescription("Tutte le statistiche su questo utente")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
            .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
            .addField(":ok_hand: Status", "```" + (status || "Offline") + "```", true)
            .addField(":robot: Is a bot", utente.user.bot ? "```Yes```" : "```No```", true)
            .addField(":pencil: Account created", "```" + moment(utente.user.createdAt).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(utente.user.createdAt).fromNow() + ")```", false)
            .addField(":red_car: Joined this server", "```" + moment(utente.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm") + " (" + moment(utente.joinedTimestamp).fromNow() + ")```", false)
            .addField(":beginner: Badge", "```" + elencoBadge + "```", false)
            .addField(":shirt: Roles", "```" + elencoRuoli + "```", false)
            .addField(":bar_chart: Statistics", `\`\`\`
Total messages: ${userstats.statistics.totalMessage}
Commands executed: ${userstats.statistics.commands}
Reactions added: ${userstats.statistics.addReaction}\`\`\``, false)

        message.channel.send({ embeds: [embed] })
            .catch(() => { })
    },
};