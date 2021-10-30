module.exports = {
    name: "userstats",
    aliases: ["user", "userinfo"],
    onlyStaff: false,
    channelsGranted: [config.idCanaliServer.commands],
    async execute(message, args, client) {
        if (!args[0]) {
            var utente = message.member;
        }
        else {
            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
            }
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!userinfo [user]`");
            return
        }

        let elencoRuoli = "";
        utente._roles.forEach(idRuolo => elencoRuoli += `- ${message.guild.roles.cache.get(idRuolo).name}\r`);

        if (elencoRuoli == "")
            elencoRuoli = "Nessun ruolo";

        let status = utente.user.presence.status;
        switch (status) {
            case "online": status = "Online"; break;
            case "offline": status = "Offline"; break;
            case "dnd": status = "Do not disturb"; break;
            case "idle": status = "Idle"; break;
        }

        const badge = await utente.user.fetchFlags()
        const userFlags = badge.toArray()
        const elencoBadge = userFlags.length ? userFlags.map(flag => flag).join(" ") : 'Nessun badge'

        let embed = new Discord.MessageEmbed()
            .setTitle(utente.user.tag)
            .setDescription("Tutte le statistiche su questo utente")
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
            .addField(":receipt: User ID", "```" + utente.user.id + "```", true)
            .addField(":ok_hand: Status", "```" + status + "```", true)
            .addField(":robot: Is a bot", utente.user.bot ? "```Yes```" : "```No```", true)
            .addField(":pencil: Account created", "```" + moment(utente.user.createdAt).format("ddd DD MMM, HH:mm") + " (" + moment(utente.user.createdAt).fromNow() + ")```", false)
            .addField(":red_car: Joined this server", "```" + moment(utente.joinedTimestamp).format("ddd DD MMM, HH:mm") + " (" + moment(utente.joinedTimestamp).fromNow() + ")```", false)
            .addField(":beginner: Badge", "```" + elencoBadge + "```", false)
            .addField(":shirt: Roles", "```" + elencoRuoli + "```", false)

        message.channel.send(embed)
    },
};