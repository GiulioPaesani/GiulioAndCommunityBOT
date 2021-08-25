const Discord = require("discord.js");
const moment = require("moment");
const ms = require("ms");

module.exports = {
    name: "tempban",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    execute(message, args, client) {
        database.collection("userstats").find().toArray(function (err, result) {
            if (err) return codeError(err);
            var userstatsList = result;

            var utente = message.mentions.members.first()
            if (!utente) {
                var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args[0])
            }

            if (!utente) {
                error(message, "Utente non trovato", "`!tempban [user] [time] (reason)`")
                return
            }

            if (utenteMod(utente)) {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                    .setColor("#9E005D")
                    .setDescription("Non puoi bannare questo utente")

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 7000 })
                    msg.delete({ timeout: 7000 })
                })
                return
            }

            var userstats = userstatsList.find(x => x.id == utente.id);
            if(!userstats) return
            
            var reason = args.slice(2).join(" ");
            if (!reason) {
                reason = "Nessun motivo";
            }

            if (userstats.moderation.type == "Muted") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente mutato")
                    .setDescription("Questo utente è mutato")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .addField(":scroll: Reason", userstats.moderation.reason)
                    .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                    .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 20000 }).catch()
                    msg.delete({ timeout: 20000 }).catch()
                })
                return
            }
            if (userstats.moderation.type == "Tempmuted") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente tempmutato")
                    .setDescription("Questo utente è mutato")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .addField(":scroll: Reason", userstats.moderation.reason)
                    .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                    .addField(":checkered_flag: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})`)
                    .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 20000 }).catch()
                    msg.delete({ timeout: 20000 }).catch()
                })
                return
            }
            if (userstats.moderation.type == "Banned") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente già bannato")
                    .setDescription("Questo utente è già bannato")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .addField(":scroll: Reason", userstats.moderation.reason)
                    .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                    .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 20000 }).catch()
                    msg.delete({ timeout: 20000 }).catch()
                })
                return
            }
            if (userstats.moderation.type == "Tempbanned") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente già tempbannato")
                    .setDescription("Questo utente è già bannato")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .addField(":scroll: Reason", userstats.moderation.reason)
                    .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                    .addField(":checkered_flag: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})`)
                    .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 20000 }).catch()
                    msg.delete({ timeout: 20000 }).catch()
                })
                return
            }
            if (userstats.moderation.type == "ForceBanned") {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Utente già bannato forzatamente")
                    .setDescription("Questo utente è già bannato")
                    .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                    .setColor("#8F8F8F")
                    .addField(":scroll: Reason", userstats.moderation.reason)
                    .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                    .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

                message.channel.send(embed).then(msg => {
                    message.delete({ timeout: 20000 }).catch()
                    msg.delete({ timeout: 20000 }).catch()
                })
                return
            }

            var time = args[1];
            if (!time) {
                error(message, "Inserire un tempo", "`!tempmute [user] [time] (reason)`")
                return
            }
            time = ms(time)
            if (!time) {
                error(message, "Tempo non valido", "`!tempmute [user] [time] (reason)`")
                return
            }

            var ruoloTempbanned = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.tempbanned)
            message.guild.channels.cache.forEach((canale) => {
                if (canale.id != config.idCanaliServer.tempbannedTicket) {
                    canale.updateOverwrite(ruoloTempbanned, {
                        VIEW_CHANNEL: false,
                        SPEAK: false
                    })
                }
            })

            utente.roles.add(ruoloTempbanned)
                .then(() => {
                    if (utente.voice.channel) {
                        utente.voice.kick();
                    }
                })

            userstats.moderation = {
                "type": "Tempbanned",
                "since": new Date().getTime(),
                "until": moment(new Date().getTime()).add(time, "ms").valueOf(),
                "reason": reason,
                "moderator": message.author.username
            }

            database.collection("userstats").updateOne({ id: userstats.id }, { $set: userstats });

            var embed = new Discord.MessageEmbed()
                .setAuthor("[TEMPBAN] " + utente.user.tag, utente.user.avatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .addField("Reason", reason)
                .addField("Time", ms(time, { long: true }))
                .addField("Moderator", message.author.toString())
                .setFooter("User ID: " + utente.user.id)

            message.channel.send(embed)

            var canale = client.channels.cache.get(config.idCanaliServer.log);
            canale.send(embed);

            var embedUtente = new Discord.MessageEmbed()
                .setTitle("Sei stato bannato temporaneamente")
                .setColor("#6143CB")
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .addField("Reason", reason)
                .addField("Time", ms(time, { long: true }))
                .addField("Moderator", message.author.toString())

            utente.send(embedUtente).catch(() => {
                return
            })
        })
    },
};
