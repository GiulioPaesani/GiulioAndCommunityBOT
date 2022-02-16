module.exports = {
    name: "setcoins",
    aliases: ["setmoney"],
    onlyStaff: true,
    availableOnDM: true,
    description: "Settare coins a un utente",
    syntax: "!setcoins [user] [coins]",
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
            return botCommandMessage(message, "NonPermesso", "", "Non puoi settare coins a questo utente")
        }

        if (message.author.id == utente.id && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "Warning", "Non a te stesso", "Non puoi settarti coins da solo")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi settare coins a un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!args[args.length - 1]) {
            return botCommandMessage(message, "Error", "Inserire un numero di coins", "Scrivi il numero di coins che vuoi settare all'utente", property)
        }

        var coins = await parseInt(args[args.length - 1]);
        if (!coins && coins != 0) {
            return botCommandMessage(message, "Error", "Numero di coins non valido", "Hai inserito un numero di coins non valido", property)
        }

        if (coins < 0) {
            return botCommandMessage(message, "Error", "Numero di coins non valido", "Hai inserito un numero di coins non valido", property)
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":paintbrush: Set coins :paintbrush:")
            .setColor("#fcba03")
            .setDescription(message.channel.type != "DM" ? `[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})` : "")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
            .addField("Coins setted", `${coins}`)
            .addField("User economy", `
Old: ${userstats.money}$
`)

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)].money = coins

        botCommandMessage(message, "Correct", "Coins settati", `**${coins} coins** settati a ${utente.toString()}`)

        embed.fields[4].value += `New: ${userstats.money}$`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.editMoney).send({ embeds: [embed] })
    },
};
