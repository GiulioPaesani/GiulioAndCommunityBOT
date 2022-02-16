module.exports = {
    name: "setlevel",
    aliases: [],
    onlyStaff: true,
    availableOnDM: true,
    description: "Settare il livello di un utente",
    syntax: "!setlevel [user] [level]",
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
            return botCommandMessage(message, "NonPermesso", "", "Non puoi settare livelli a questo utente")
        }

        if (message.author.id == utente.id && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi settarti livelli da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi settare livelli a un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un livello", "Scrivi il livello che vuoi settare all'utente", property)
        }

        var levels = await parseInt(args[args.length - 1]);
        if (!levels && levels != 0) {
            return botCommandMessage(message, "Error", "Livello non valido", "Hai inserito un livello non valido", property)
        }

        if (levels < 0) {
            return botCommandMessage(message, "Error", "Livello non valido", "Hai inserito un livello non valido", property)
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":paintbrush: Set level :paintbrush:")
            .setColor("#fcba03")
            .setDescription(message.channel.type != "DM" ? `[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})` : "")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
            .addField("Level setted", `${levels}`)
            .addField("User level", `
Old: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})
`)

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)].level = levels
        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)].xp = getXpNecessari(levels)

        setLevelRole(utente, levels)

        botCommandMessage(message, "Correct", "Livello settato", `Livello **${levels}** impostato a ${utente.toString()}`)

        embed.fields[4].value += `New: Lvl. ${userstats.level} (XP: ${humanize(userstats.xp)})`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
    },
};