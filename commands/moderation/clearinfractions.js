module.exports = {
    name: "clearwarn",
    aliases: ["clearinfractions", "clearinfraction", "clearinfrazioni"],
    onlyStaff: true,
    availableOnDM: false,
    description: "Eliminare le infrazioni di un utente",
    syntax: "!clearwarn [user] (code)",
    category: "moderation",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var utente = message.mentions.members?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "), args.slice(0, -1).join(" "))
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        try {
            var code = parseInt(args[args.length - 1]);
        } catch {
            return botCommandMessage(message, "Error", "Codice non valido", "Hai inserito un codice non esistente o non valido", property)
        }

        if (utenteMod(utente) && message.author.id != settings.idGiulio) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi cancellare le infrazioni a questo utente")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi rimuovere le infrazioni di un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (userstats.warn.length == 0) {
            return botCommandMessage(message, "Warning", "Utente senza infrazioni", "Questo utente è già senza infrazioni")
        }
        else {
            var warnList = ""
            if (!code) {
                userstats.warn.forEach(warn => {
                    warnList += `- ${warn.reason}\r`
                })

                botCommandMessage(message, "Correct", "Tutte le infrazioni eliminate", `Sono state eliminate tutte le **${userstats.warn.length} infrazioni** di ${utente.toString()}`)

                userstats.warn = [];
            }
            else {
                if (!userstats.warn.hasOwnProperty(code - 1)) {
                    return botCommandMessage(message, "Error", "Codice non valido", "Hai inserito un codice non esistente o non valido", property)
                }

                warnList = `- ${userstats.warn[code - 1].reason}`

                botCommandMessage(message, "Correct", "Infrazione eliminata", `Infrazione di ${utente.toString()} eliminata \r\`\`\`#${code} - ${userstats.warn[code - 1].reason} (${moment(userstats.warn[code - 1].time).fromNow()})\`\`\``)

                delete userstats.warn.splice(code - 1, 1)
            }

            if (utente.user) utente = utente.user

            var embed = new Discord.MessageEmbed()
                .setTitle(":fire_extinguisher: Clear warns :fire_extinguisher:")
                .setColor("#8227cc")
                .setDescription(`[Message link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`)
                .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                .addField("Infractions", warnList.length > 1000 ? `${warnList.slice(0, 993)}...` : warnList, false)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.clearwarn).send({ embeds: [embed] })

            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
        }
    },
};
