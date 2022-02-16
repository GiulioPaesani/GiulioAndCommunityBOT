module.exports = {
    name: "addlevel",
    aliases: [],
    onlyStaff: true,
    availableOnDM: true,
    description: "Aggiungere livelli a un utente",
    syntax: "!addlevel [user] [level]",
    category: "ranking",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "), args.slice(0, -1).join(" "))
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utenteMod(utente) && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi aggiungere livelli a questo utente")
        }

        if (message.author.id == utente.id && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi aggiungerti livelli da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi aggiungere livelli a un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un numero di livelli", "Scrivi il numero di livelli che vuoi aggiungere all'utente", property)
        }

        var levels = await parseInt(args[args.length - 1]);
        if (!levels) {
            return botCommandMessage(message, "Error", "Numero di livelli non valido", "Hai inserito un numero di livelli non valido", property)
        }

        if (levels < 0) {
            return botCommandMessage(message, "Error", "Numero di livelli non valido", "Hai inserito un numero di livelli non valido", property)
        }

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setTitle(":inbox_tray: Add levels :inbox_tray:")
            .setColor("#22c90c")
            .setDescription(message.channel.type != "DM" ? `[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})` : "")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
            .addField("Levels added", `+${levels}`)
            .addField("User level", `
Old: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})
`)

        userstats.level = userstats.level + levels
        userstats.xp = getXpNecessari(userstats.level)

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        setLevelRole(utente, userstats.level)

        if (levels == 1)
            botCommandMessage(message, "Correct", "Livello aggiunto", `**${levels} livello** aggiunto a ${utente.toString()}`)
        else
            botCommandMessage(message, "Correct", "Livelli aggiunti", `**${levels} livelli** aggiunti a ${utente.toString()}`)

        embed.fields[4].value += `New: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
    },
};
