module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != config.idServer) return
        if (utenteMod(message.member)) return
        if (!userstatsList) return

        if (message.channel.rateLimitPerUser == 0) return

        //Individual Spam
        if (usersIndividualSpam.has(message.author.id)) {
            if (message.channel.id == config.idCanaliServer.counting) return

            const user = usersIndividualSpam.get(message.author.id);

            if (message.createdTimestamp - user.lastMessage <= 5000) {
                user.msgCount++
                if (user.msgCount >= 7) {
                    var ruoloTempmuted = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.tempmuted);
                    message.guild.channels.cache.forEach((canale) => {
                        if (canale.id != config.idCanaliServer.tempmutedTicket) {
                            canale.updateOverwrite(ruoloTempmuted, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                                SPEAK: false
                            })
                        }
                    })

                    var userstats = userstatsList.find(x => x.id == message.author.id);
                    if (!userstats) return

                    message.member.roles.add(ruoloTempmuted)
                        .then(() => {
                            if (message.member.voice.channel) {
                                var canale = message.member.voice.channelID
                                if (canale == config.idCanaliServer.general1)
                                    message.member.voice.setChannel(config.idCanaliServer.general2)
                                else
                                    message.member.voice.setChannel(config.idCanaliServer.general1)
                                message.member.voice.setChannel(canale)
                            }
                        })

                    var time = 600000; //10 minuti
                    var reason = "Spam di messaggi ripetuti";

                    userstats.moderation = {
                        "type": "Tempmuted",
                        "since": new Date().getTime(),
                        "until": moment(new Date().getTime()).add(time, "ms").valueOf(),
                        "reason": reason,
                        "moderator": config.idBot
                    }

                    userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

                    var embed = new Discord.MessageEmbed()
                        .setAuthor("[TEMPMUTE] " + message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
                        .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
                        .setColor("#6143CB")
                        .addField("Reason", reason)
                        .addField("Time", ms(time, { long: true }))
                        .addField("Moderator", "GiulioAndCommunity BOT")
                        .setFooter("User ID: " + message.member.user.id)

                    message.channel.send(embed)

                    var canale = client.channels.cache.get(config.idCanaliServer.log);
                    canale.send(embed);

                    var embedUtente = new Discord.MessageEmbed()
                        .setTitle("Sei stato mutato temporaneamente")
                        .setColor("#6143CB")
                        .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
                        .addField("Reason", reason)
                        .addField("Time", ms(time, { long: true }))
                        .addField("Moderator", "GiulioAndCommunity BOT")

                    message.member.send(embedUtente).catch(() => {
                        return
                    })

                    usersIndividualSpam.delete(message.author.id);
                    return
                }

                user.lastMessage = message.createdTimestamp;

                usersIndividualSpam.set(message.author.id, user)
            }
            else {
                user.msgCount = 1
                user.lastMessage = message.createdTimestamp
                usersIndividualSpam.set(message.author.id, user)
            }
        }
        else {
            usersIndividualSpam.set(message.author.id, {
                userID: message.author.id,
                msgCount: 1,
                lastMessage: message.createdTimestamp
            });
        }

        //Group Spam
        if (usersGroupSpam.has(message.channel.id)) {
            var channel = usersGroupSpam.get(message.channel.id)
            if (message.createdTimestamp - channel.lastMessage <= 2000) {
                channel.lastMessage = message.createdTimestamp
                channel.msgCount++

                if (channel.msgCount >= 10) {
                    if (!serverstats.lockdown) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                            .setColor("#ED1C24")
                            .setDescription("È appena stato attivato il **sistema di lockdown** automaticamente per una rilevazione di **spam eccessivo**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
                        message.channel.send(embed)

                        serverstats.lockdown = true;

                        ruolo.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD"])

                        var canale = client.channels.cache.get(config.idCanaliServer.lockdown);
                        canale.updateOverwrite(ruolo, {
                            VIEW_CHANNEL: true,
                        })
                        canale.messages.fetch("873963745938919495")
                            .then(msg => {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                                    .setColor("#ED1C24")
                                    .setDescription(`È appena stato attivato il **sistema di lockdown** automaticamente per una rilevazione di **spam eccessivo**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${config.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                                msg.edit(embed)
                            })

                        if (message.channel.id == config.idCanaliServer.general) return
                        var canale = client.channels.cache.get(config.idCanaliServer.general);
                        canale.send(embed);
                    }

                    channel.msgCount = 0;
                    return
                }
            }
            else {
                channel.msgCount = 1
                channel.lastMessage = message.createdTimestamp
                usersGroupSpam.set(message.channel.id, channel)
            }
        }
        else {
            usersGroupSpam.set(message.channel.id, {
                channelID: message.channel.id,
                msgCount: 1,
                lastMessage: message.createdTimestamp
            });
        }
    },
};