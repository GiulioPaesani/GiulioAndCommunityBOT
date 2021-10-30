module.exports = {
    name: "infractions",
    aliases: ["infraction", "infrazioni"],
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
            error(message, "Utente non trovato", "`!warn [user] (reason)`")
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        var warn = userstats.warn;

        var embed = new Discord.MessageEmbed()
            .setTitle("INFRACTIONS - " + utente.user.tag)
            .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))

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
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})
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
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})
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
            message.channel.send(embed)
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
            let page = 0;

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
                    .setFooter("Scorri tra le infrazioni con le reazioni qua sotto")
            }
            else {
                embed
                    .addField(":no_entry_sign: All infractions", "```" + elencoInfrazioni + "```", false)
            }

            message.channel.send(embed)
                .then(msg => {
                    if (totalPage != 1) {

                        msg.react("◀️")
                        msg.react("▶️")

                        // Filters
                        const reactIndietro = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
                        const reactAvanti = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

                        const paginaIndietro = msg.createReactionCollector(reactIndietro)
                        const paginaAvanti = msg.createReactionCollector(reactAvanti)

                        paginaIndietro.on('collect', (r, u) => {
                            page--
                            page < 0 ? page = (totalPage - 1) : ""

                            var elencoInfrazioni = ""
                            for (var i = page * 10; i < (page * 10 + ((page * 10 + 10) > warn.length ? warn.length % 10 : 10)); i++) {
                                elencoInfrazioni += `#${i + 1} - ${warn[i].reason} (${moment(warn[i].time).fromNow()})\r`
                            }

                            embed.fields[3].name = `:no_entry_sign: All infractions ${page + 1}/${totalPage}`
                            embed.fields[3].value = "```" + elencoInfrazioni + "```"

                            msg.edit(embed)

                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                        paginaAvanti.on('collect', (r, u) => {
                            page++
                            page > totalPage - 1 ? page = 0 : ""

                            var elencoInfrazioni = ""
                            for (var i = page * 10; i < (page * 10 + ((page * 10 + 10) > warn.length ? warn.length % 10 : 10)); i++) {
                                elencoInfrazioni += `#${i + 1} - ${warn[i].reason} (${moment(warn[i].time).fromNow()})\r`
                            }

                            embed.fields[3].name = `:no_entry_sign: All infractions ${page + 1}/${totalPage}`
                            embed.fields[3].value = "```" + elencoInfrazioni + "```"

                            msg.edit(embed)

                            r.users.remove(r.users.cache.filter(u => u === message.author).first())
                        })
                    }
                })
        }
    },
};
