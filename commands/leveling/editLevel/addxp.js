module.exports = {
    name: "addxp",
    aliases: [],
    onlyStaff: true,
    availableOnDM: true,
    description: "Aggiungere punti esperienza a un utente",
    syntax: "!addxp [user] [xp]",
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
            return botCommandMessage(message, "NonPermesso", "", "Non puoi aggiungere xp a questo utente")
        }

        if (message.author.id == utente.id && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi aggiungerti xp da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi aggiungere xp a un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un numero di xp", "Scrivi il numero di punti esperienza che vuoi aggiungere all'utente", property)
        }

        var xp = await parseInt(args[args.length - 1]);
        if (!xp) {
            return botCommandMessage(message, "Error", "Numero di xp non valido", "Hai inserito un numero di punti esperienza non valido", property)
        }

        if (xp < 0) {
            return botCommandMessage(message, "Error", "Numero di xp non valido", "Hai inserito un numero di punti esperienza non valido", property)
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":inbox_tray: Add xp :inbox_tray:")
            .setColor("#22c90c")
            .setDescription(message.channel.type != "DM" ? `[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})` : "")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
            .addField("Xp added", `+${xp}`)
            .addField("User level", `
Old: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})
`)

        userstats = await addXp(userstats, xp, 0, true);

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        botCommandMessage(message, "Correct", "Xp aggiunti", `**${xp} punti esperienza** aggiunti a ${utente.toString()}`)

        embed.fields[4].value += `New: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
    },
};
