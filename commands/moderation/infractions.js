module.exports = {
    name: "infractions",
    aliases: ["infraction", "infrazioni"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Visualizzare tutte le infrazioni e le info di moderazione di un utente",
    syntax: "!infractions (user)",
    category: "moderation",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var utente = message.author;
        }
        else {
            var utente = message.mentions.users?.first()
            if (!utente) {
                var utente = await getUser(args.join(" "))
            }
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non un bot", "Non puoi visualizzare le infrazioni di un bot")
        }

        if (utente.user) utente = utente.user

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var warn = userstats.warn;

        var embed = new Discord.MessageEmbed()
            .setTitle("Infractions - " + (utente.nickname ? utente.nickname : utente.username))
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))

        if (userstats.moderation.type == "Muted") {
            embed
                .addField(":sound: MUTED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`)
        }
        if (userstats.moderation.type == "Tempmuted") {
            embed
                .addField(":sound: TEMPMUTED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Until**
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})
**Moderator**
${userstats.moderation.moderator}           
`)
        }
        if (userstats.moderation.type == "Banned") {
            embed
                .addField(":speaker: BANNED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`)
        }
        if (userstats.moderation.type == "Tempbanned") {
            embed
                .addField(":speaker: TEMPBANNED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Until**
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})
**Moderator**
${userstats.moderation.moderator}           
`)
        }
        if (userstats.moderation.type == "ForceBanned") {
            embed
                .addField(":mute: FORCEBANNED", `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`)
        }

        if (warn.length == 0) {
            embed
                .addField(":interrobang: Total", "```Nessuna infrazione```", false)

            message.channel.send({ embeds: [embed] })
                .catch(() => { })
        }
        else {
            var ultimi7d = 0
            var ultime24h = 0
            var elencoInfrazioni = ""

            for (var index in warn) {
                var time = warn[index].time;
                var timeOra = new Date().getTime();
                var diff = timeOra - time;

                if (diff <= 86400000) {
                    ultime24h++;
                }
                if (diff <= 604800000) {
                    ultimi7d++;
                }
            }

            var totalPage = Math.ceil(warn.length / 10);
            var page = 0;

            for (var i = page * 10; i < (page * 10 + ((page * 10 + 10) > warn.length ? warn.length % 10 : 10)); i++) {
                elencoInfrazioni += `#${i + 1} - ${warn[i].reason} (${moment(warn[i].time).fromNow()})\r`
            }

            embed
                .addField(":interrobang: Total", "```" + warn.length + "```", false)
                .addField(":exclamation: Last 24 hours", "```" + ultime24h + "```", true)
                .addField(":question: Last 7 days", "```" + ultimi7d + "```", true)

            if (totalPage != 1) {
                embed
                    .addField(`:no_entry_sign: All infractions ${page + 1}/${totalPage}`, "```" + elencoInfrazioni + "```", false)
                    .setFooter(`Page ${page + 1}/${totalPage}`)
            }
            else {
                embed
                    .addField(":no_entry_sign: All infractions", "```" + elencoInfrazioni + "```", false)
            }

            var button1 = new Discord.MessageButton()
                .setCustomId(`indietroInfractions,${message.author.id},${page},${utente.id}`)
                .setStyle("PRIMARY")
                .setEmoji("◀️")

            if (page == 0)
                button1.setDisabled()

            var button2 = new Discord.MessageButton()
                .setCustomId(`avantiInfractions,${message.author.id},${page},${utente.id}`)
                .setStyle("PRIMARY")
                .setEmoji("▶️")

            if (page == totalPage)
                button2.setDisabled()

            if (totalPage != 1) {
                var row = new Discord.MessageActionRow()
                    .addComponents(button1)
                    .addComponents(button2)
                message.channel.send({ embeds: [embed], components: [row] })
            }
            else {
                message.channel.send({ embeds: [embed] })
                // .catch(() => { })
            }
        }
    },
};
