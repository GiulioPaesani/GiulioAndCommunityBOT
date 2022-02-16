global.getParolaccia = function (content) {
    content = content.replace(/\*/g, "\*")
    content = content.replace(/\\/g, "")

    var trovata = false;
    var censurato = content;
    var nonCensurato = content;

    const badwords = require("../config/badwords.json");
    for (var paroloccia in badwords) {
        if (content.includes(badwords[paroloccia])) {
            trovata = true;
            nonCensurato = nonCensurato.replace(eval(`/${badwords[paroloccia]}/g`), `**${badwords[paroloccia]}**`)

            var aiLatiDaNonCensurare = Math.floor(Math.floor(badwords[paroloccia].length) / 3);

            var parolaCensurata = badwords[paroloccia].slice(0, -1 * (badwords[paroloccia].length - aiLatiDaNonCensurare)) + '#'.repeat(badwords[paroloccia].length - aiLatiDaNonCensurare - aiLatiDaNonCensurare) + badwords[paroloccia].slice(badwords[paroloccia].length - aiLatiDaNonCensurare)

            censurato = censurato.replace(eval(`/${badwords[paroloccia]}/g`), `**${parolaCensurata}**`)
        }
    }

    return [trovata, nonCensurato, censurato]
}

global.checkModeration = async function () {
    var server = await getGuild()

    for (var index in userstatsList) {
        if (userstatsList[index].moderation && userstatsList[index].moderation.type == "Tempmuted" && userstatsList[index].moderation.until <= new Date().getTime()) {

            var utente = await getUser(userstatsList[index].id);
            if (utente) {
                var userstats = userstatsList.find(x => x.id == utente.id);

                if (server.members.cache.find(x => x.id == utente.id)) {
                    utente.roles.remove(settings.ruoliModeration.tempmuted).then(() => {
                        if (utente.voice) {
                            if (utente.voice?.channel) {
                                var canale = utente.voice.channelId
                                if (canale == settings.idCanaliServer.general1)
                                    utente.voice.setChannel(settings.idCanaliServer.general2)
                                else
                                    utente.voice.setChannel(settings.idCanaliServer.general1)
                                utente.voice.setChannel(canale)
                            }
                        }
                    })
                }
                else {
                    userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempmuted)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("Sei stato smutato")
                    .setColor("#6143CB")
                    .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
                    .addField("Reason", userstats.moderation.reason || "_Null_")
                    .addField("Time muted", ms(userstats.moderation.until - userstats.moderation.since, { long: true }))
                    .addField("Moderator", client.user.toString())

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                if (utente.user) utente = utente.user

                var embed = new Discord.MessageEmbed()
                    .setTitle(":loud_sound: Unmute :loud_sound:")
                    .setColor("#8227cc")
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${client.user.toString()}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Duration", `${ms(userstats.moderation.until - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                    .addField("Reason", userstats.moderation.reason || "_Null_", false)

                client.channels.cache.get(log.moderation.unmute).send({ embeds: [embed] })

                userstats.moderation = {
                    "type": "",
                    "since": "",
                    "until": "",
                    "reason": "",
                    "moderator": "",
                    "ticketOpened": false
                }

                userstatsList[index] = userstats
            }
        }

        if (userstatsList[index].moderation && userstatsList[index].moderation.type == "Tempbanned" && userstatsList[index].moderation.until <= new Date().getTime()) {
            var utente = await getUser(userstatsList[index].id);
            if (utente) {
                var userstats = userstatsList.find(x => x.id == utente.id);

                if (server.members.cache.find(x => x.id == utente.id)) {
                    utente.roles.remove(settings.ruoliModeration.tempbanned)
                }
                else {
                    userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempbanned)
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle("Sei stato sbannato")
                    .setColor("#6143CB")
                    .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
                    .addField("Reason", userstats.moderation.reason || "_Null_")
                    .addField("Time banned", ms(userstats.moderation.until - userstats.moderation.since, { long: true }))
                    .addField("Moderator", client.user.toString())

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                if (utente.user) utente = utente.user

                var embed = new Discord.MessageEmbed()
                    .setTitle(":name_badge: Unban :name_badge:")
                    .setColor("#8227cc")
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${client.user.toString()}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Time", `${ms(userstats.moderation.until - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                    .addField("Reason", userstats.moderation.reason || "_Null_", false)

                client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })

                userstats.moderation = {
                    "type": "",
                    "since": "",
                    "until": "",
                    "reason": "",
                    "moderator": "",
                    "ticketOpened": false
                }

                userstatsList[index] = userstats
            }
        }
    }
}

global.checkUnverifedUser = function () {
    var server = client.guilds.cache.get(settings.idServer)
    var users = server.members.cache.filter(x => x.roles.cache.has(settings.idRuoloNonVerificato))

    users.forEach(user => {
        if (!utenteMod(user)) {
            if (new Date().getTime() - user.joinedTimestamp > 345600000) { //Utente ancora non verificato da 4 giorni
                var embed = new Discord.MessageEmbed()
                    .setTitle(":skull: User not verified :skull:")
                    .setColor("#ababab")
                    .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${user.user.toString()} - ID: ${user.id}`, false)
                    .addField("Joined server", `${moment(user.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(user.joinedTimestamp).fromNow()})`, false)

                client.channels.cache.get(log.server.other).send({ embeds: [embed] })

                var embed = new Discord.MessageEmbed()
                    .setTitle("Non ti sei VERIFICATO")
                    .setColor(`#919191`)
                    .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                    .setDescription("Sono passati più di **4 giorni** da quanto hai provato ad entrare nel server, ma non ti sei verificato e sei stato **espulso**.\r[Rientra nel server](https://discord.gg/bTF589dQd6) per poter **accedere** di nuovo e iniziare a parlare con tutti gli utenti")

                user.send({ embeds: [embed] })
                    .then(() => {
                        user.kick()
                            .catch(() => { })
                    })
                    .catch(() => {
                        user.kick()
                            .catch(() => { })
                    })
            }

            if (Math.round(new Date().getTime() / 1000) - Math.round(user.joinedTimestamp / 1000) == 3600) { //Utente ancora non verificato da un ora
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non ti sei ancora VERIFICATO")
                    .setColor(`#919191`)
                    .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                    .setDescription(`È passata più di **un ora** da quanto hai provato ad entrare nel server, ma non ti sei ancora **verificato**\rVai nel canale <#${settings.idCanaliServer.joinTheServer}>, leggi le regole e clicca sul bottone **"Entra nel server"**`)

                user.send({ embeds: [embed] })
                    .catch(() => { })
            }
        }
    });
}