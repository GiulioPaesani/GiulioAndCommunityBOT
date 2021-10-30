global.getParolaccia = function (content) {
    content = content.replace(/\*/g, "\*")
    content = content.replace(/\\/g, "")

    var trovata = false;
    let censurato = content;
    let nonCensurato = content;

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

global.checkModeration = function () {
    for (var index in userstatsList) {
        if (userstatsList[index].moderation.until <= new Date().getTime() && userstatsList[index].moderation.type == "Tempmuted") {
            var canale = client.channels.cache.get(config.idCanaliServer.log);
            var server = client.guilds.cache.get(config.idServer);

            var ruoloTempmuted = server.roles.cache.find(role => role.id == config.ruoliModeration.tempmuted);

            var utente = server.members.cache.find(x => x.id == userstatsList[index].id);
            if (utente) {
                utente.roles.remove(ruoloTempmuted).then(() => {
                    if (utente.voice) {
                        if (utente.voice.channel) {
                            var canale = utente.voice.channelID
                            if (canale == config.idCanaliServer.general1)
                                utente.voice.setChannel(config.idCanaliServer.general2)
                            else
                                utente.voice.setChannel(config.idCanaliServer.general1)
                            utente.voice.setChannel(canale)
                        }
                    }
                })
            }

            var utente = client.users.cache.get(userstatsList[index].id);

            var embed = new Discord.MessageEmbed()
                .setAuthor("[UNTEMPMUTE] " + utente.username + "#" + utente.discriminator, utente.displayAvatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
                .setColor("#6143CB")
                .addField("Reason", userstatsList[index].moderation.reason)
                .addField("Moderator", "<@802184359120863272>")
                .addField("Time muted", ms(new Date().getTime() - userstatsList[index].moderation.since, { long: true }))
                .setFooter("User ID: " + userstatsList[index].id)

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato smutato")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
                .addField("Reason", userstatsList[index].moderation.reason)
                .addField("Time muted", ms(new Date().getTime() - userstatsList[index].moderation.since, { long: true }))
                .addField("Moderator", "<@802184359120863272>")

            utente.send(embedUtente).catch(() => { })

            canale.send(embed);

            userstatsList[index].moderation = {
                "type": "",
                "since": "",
                "until": "",
                "reason": "",
                "moderator": ""
            }

            userstatsList[index].roles = userstatsList[index].roles.filter(x => x != config.ruoliModeration.tempmuted)
        }

        if (userstatsList[index].moderation.until <= new Date().getTime() && userstatsList[index].moderation.type == "Tempbanned") {
            var canale = client.channels.cache.get(config.idCanaliServer.log);
            var server = client.guilds.cache.get(config.idServer);

            var ruoloTempbanned = server.roles.cache.find(role => role.id == config.ruoliModeration.tempbanned)

            var utente = server.members.cache.find(x => x.id == userstatsList[index].id);
            if (utente) {
                utente.roles.remove(ruoloTempbanned)
            }

            var utente = client.users.cache.get(userstatsList[index].id);

            var embed = new Discord.MessageEmbed()
                .setAuthor("[UNTEMPBAN] " + utente.username + "#" + utente.discriminator, utente.displayAvatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .addField("Reason", userstatsList[index].moderation.reason)
                .addField("Moderator", "<@802184359120863272>")
                .addField("Time banned", ms(new Date().getTime() - userstatsList[index].moderation.since, { long: true }))
                .setFooter("User ID: " + userstatsList[index].id)

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato sbannato")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .addField("Reason", userstatsList[index].moderation.reason)
                .addField("Moderator", "<@802184359120863272>")
                .addField("Time banned", ms(new Date().getTime() - userstatsList[index].moderation.since, { long: true }))


            utente.send(embedUtente).catch(() => { })

            canale.send(embed);

            userstatsList[index].moderation = {
                "type": "",
                "since": "",
                "until": "",
                "reason": "",
                "moderator": ""
            }

            userstatsList[index].roles = userstatsList[index].roles.filter(x => x != config.ruoliModeration.tempbanned)
        }
    }
}

global.checkUnverifedUser = function () {
    var server = client.guilds.cache.get(config.idServer)
    var users = server.members.cache.filter(x => x.roles.cache.has(config.idRuoloNonVerificato)).array()

    users.forEach(user => {
        if (new Date().getTime() - user.joinedTimestamp > 345600000) { //Utente ancora non verificato da 4 giorni
            var embed = new Discord.MessageEmbed()
                .setTitle("Non ti sei VERIFICATO")
                .setColor(`#8F8F8F`)
                .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                .setDescription("Sono passati più di **4 giorni** da quanto hai provato ad entrare nel server, ma non ti sei verificato e sei stato **espulso**.\r[Rientra nel server](https://discord.gg/bTF589dQd6) per poter **accedere** di nuovo e iniziare a parlare con tutti gli utenti")

            user.send(embed)
                .then(() => {
                    user.kick()
                })
                .catch(() => {
                    user.kick()
                        .catch(() => { })
                })
        }

        if (Math.round(new Date().getTime() / 1000) - Math.round(user.joinedTimestamp / 1000) == 3600) { //Utente ancora non verificato da un ora
            var embed = new Discord.MessageEmbed()
                .setTitle("Non ti sei ancora VERIFICATO")
                .setColor(`#8F8F8F`)
                .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                .setDescription(`È passata più di **un ora** da quanto hai provato ad entrare nel server, ma non ti sei ancora **verificato**\rVai nel canale <#${config.idCanaliServer.joinTheServer}>, leggi le regole e clicca sul bottone **"Entra nel server"**`)

            user.send(embed)
                .catch(() => { })
        }
    });
}