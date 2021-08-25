const Discord = require('discord.js');
require(`../index.js`);
const ms = require("ms");
const { MessageAttachment } = require('discord.js');
const moment = require("moment")
const ytch = require('yt-channel-info');
var MongoClient = require('mongodb').MongoClient;

global.utenteMod = function (member) {
    for (const [name, idRuolo] of Object.entries(config.ruoliStaff)) {
        if (member.roles.cache.has(idRuolo)) return true
    }
    return false
}

global.codeError = function (err) {
    var embed = new Discord.MessageEmbed()
        .setTitle(`ERROR`)
        .setThumbnail(`https://images-ext-1.discordapp.net/external/8DoN43XFJZCFvTRZXpq443nx7s0FaLVesjgSNnlBTec/https/i.postimg.cc/zB4j8xVZ/Error.png?width=630&height=630`)
        .setColor(`#ED1C24`)
        .setDescription(err)

    var utente = client.users.cache.get(config.idGiulio);
    utente.send(embed);
    console.log(err)
}
global.permesso = function (message, comando) {
    var embed = new Discord.MessageEmbed()
        .setTitle(`Non hai il permesso`)
        .setThumbnail(`https://i.postimg.cc/D0scZ1XW/No-permesso.png`)
        .setColor(`#9E005D`)
        .setDescription(`Non puoi eseguire il comando \`${comando}\` perchè non hai il permesso`)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 20000 }).catch()
        msg.delete({ timeout: 20000 }).catch()
    })
}
global.error = function (message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail(`https://i.postimg.cc/zB4j8xVZ/Error.png`)
        .setColor(`#ED1C24`)
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 20000 }).catch()
        msg.delete({ timeout: 20000 }).catch()
    })
}
global.warming = function (message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail(`https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png`)
        .setColor(`#8F8F8F`)
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 20000 }).catch()
        msg.delete({ timeout: 20000 }).catch()
    })
}
global.correct = function (message, title, description) {
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail(`https://i.postimg.cc/SRpBjMg8/Giulio.png`)
        .setColor(`#16A0F4`)
        .setDescription(description)

    message.channel.send(embed).then(msg => {
        message.delete({ timeout: 20000 }).catch()
        msg.delete({ timeout: 20000 }).catch()
    })
}

global.calcoloXpNecessario = function (level) {
    var xpNecessarioFinoA10 = [0, 70, 250, 370, 550, 840, 1200, 1950, 2500, 3000, 3900]

    if (level < 10) {
        xpNecessario = xpNecessarioFinoA10[level]
    }
    else {
        xpNecessario = (level) * (level) * 50
    }
    return xpNecessario
}
global.setLevelRole = async function (member, level) {
    let ruoloDaAvere = "";
    if (level >= 200)
        ruoloDaAvere = config.ruoliLeveling.level200
    else if (level >= 150)
        ruoloDaAvere = config.ruoliLeveling.level150
    else if (level >= 100)
        ruoloDaAvere = config.ruoliLeveling.level100
    else if (level >= 90)
        ruoloDaAvere = config.ruoliLeveling.level90
    else if (level >= 80)
        ruoloDaAvere = config.ruoliLeveling.level80
    else if (level >= 70)
        ruoloDaAvere = config.ruoliLeveling.level70
    else if (level >= 60)
        ruoloDaAvere = config.ruoliLeveling.level60
    else if (level >= 50)
        ruoloDaAvere = config.ruoliLeveling.level50
    else if (level >= 45)
        ruoloDaAvere = config.ruoliLeveling.level45
    else if (level >= 40)
        ruoloDaAvere = config.ruoliLeveling.level40
    else if (level >= 35)
        ruoloDaAvere = config.ruoliLeveling.level35
    else if (level >= 30)
        ruoloDaAvere = config.ruoliLeveling.level30
    else if (level >= 25)
        ruoloDaAvere = config.ruoliLeveling.level25
    else if (level >= 20)
        ruoloDaAvere = config.ruoliLeveling.level20
    else if (level >= 15)
        ruoloDaAvere = config.ruoliLeveling.level15
    else if (level >= 10)
        ruoloDaAvere = config.ruoliLeveling.level10
    else if (level >= 5)
        ruoloDaAvere = config.ruoliLeveling.level5

    if (ruoloDaAvere != "") {
        if (!member.roles.cache.has(ruoloDaAvere)) {
            await member.roles.add(ruoloDaAvere)
        }
    }

    for (var ruolo in config.ruoliLeveling) {
        if (member.roles.cache.has(config.ruoliLeveling[ruolo]) && config.ruoliLeveling[ruolo] != ruoloDaAvere) {
            await member.roles.remove(config.ruoliLeveling[ruolo])
        }
    }
}

global.getParolaccia = function (content) {
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
    database.collection("userstats").find().toArray(function (err, result) {
        if (err) return codeError(err);
        var userstatsList = result;

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
                                if (canale == "801120572053520414")
                                    utente.voice.setChannel("793781892800839720")
                                else
                                    utente.voice.setChannel("801120572053520414")
                                utente.voice.setChannel(canale)
                            }
                        }
                    })
                }

                var utente = client.users.cache.get(userstatsList[index].id);

                var embed = new Discord.MessageEmbed()
                    .setAuthor("[UNTEMPMUTE] " + utente.username + "#" + utente.discriminator, utente.avatarURL({ dynamic: true }))
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

                database.collection("userstats").updateOne({ id: userstatsList[index].id }, { $set: userstatsList[index] });
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
                    .setAuthor("[UNTEMPBAN] " + utente.username + "#" + utente.discriminator, utente.avatarURL({ dynamic: true }))
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

                database.collection("userstats").updateOne({ id: userstatsList[index].id }, { $set: userstatsList[index] });
            }
        }
    })
}

global.makeBackup = function () {
    var data = new Date()
    if (data.getHours() == 12 && data.getMinutes() == 0 && data.getSeconds() == 0) {
        database.collection("userstats").find().toArray(function (err, userstatsList) {
            if (err) return codeError(err);

            database.collection("serverstats").find().toArray(function (err, serverstats) {
                if (err) return codeError(err);

                var embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Auto backup :inbox_tray:")
                    .setDescription("Backup di tutto il contenuto dei **database** di <@802184359120863272>")
                    .setColor("#757575")
                    .addField("Time", "```" + moment().format("dddd DD MMMM, HH:mm:ss") + "```")

                var attachment1 = new MessageAttachment(Buffer.from(JSON.stringify(userstatsList, null, "\t")), "userstats.json");
                var attachment2 = new MessageAttachment(Buffer.from(JSON.stringify(serverstats, null, "\t")), "serverstats.json");

                var canale = client.channels.cache.get(config.idCanaliServer.log);
                canale.send(embed);
                canale.send(attachment1);
                canale.send(attachment2);
            })
        })
    }
}

global.youtubeNotification = function () {
    database.collection("serverstats").find().toArray(function (err, result) {
        if (err) return codeError(err);
        var serverstats = result[0];

        const channelId = 'UCK6QwAdGWOWN9AT1_UQFGtA'
        const sortBy = 'newest'
        ytch.getChannelVideos(channelId, sortBy).then((response) => {
            if (serverstats.lastVideo != response.items[0].videoId) {
                var canale = client.channels.cache.get(config.idCanaliServer.youtubeNotification);
                canale.send(`
-------------:red_circle: 𝐍𝐄𝐖 𝐕𝐈𝐃𝐄𝐎 :red_circle:-------------
Ehy ragazzi, è appena uscito un nuovo video su GiulioAndCode
Andate subito a vedere **${response.items[0].title}**

https://www.youtube.com/watch?v=${response.items[0].videoId}
<@&857544584691318814>
                `)
                serverstats.lastVideo = response.items[0].videoId;
                database.collection("serverstats").updateOne({}, { $set: serverstats });
            }
        })
    })
}

global.getDatabase = async function () {
    console.log("ciao")
    const url = `mongodb+srv://giulioandcode:${process.env.passworddb}@clustergiulioandcommuni.xqwnr.mongodb.net/test`;
    const db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    database = await db.db("GiulioAndCommunity")
    return database
}