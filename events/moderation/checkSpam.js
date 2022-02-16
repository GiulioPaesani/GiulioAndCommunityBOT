module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (utenteMod(message.author)) return
        if (!userstatsList) return

        if (message.channel.rateLimitPerUser == 0) return

        //Individual Spam
        if (usersIndividualSpam.has(message.author.id)) {
            if (message.channel.id == settings.idCanaliServer.counting) return

            const user = usersIndividualSpam.get(message.author.id);

            if (message.createdTimestamp - user.lastMessage <= 4000) {
                user.msgCount++
                if (user.msgCount >= 7) {
                    var ruoloTempmuted = message.guild.roles.cache.find(role => role.id == settings.ruoliModeration.tempmuted);
                    message.guild.channels.cache.forEach((canale) => {
                        if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket) {
                            canale.permissionOverwrites.edit(ruoloTempmuted, {
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
                                var canale = message.member.voice.channelId
                                if (canale == settings.idCanaliServer.general1)
                                    message.member.voice.setChannel(settings.idCanaliServer.general2)
                                else
                                    message.member.voice.setChannel(settings.idCanaliServer.general1)
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
                        "moderator": settings.idBot,
                        "ticketOpened": false
                    }

                    userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

                    var embed = new Discord.MessageEmbed()
                        .setAuthor("[TEMPMUTE] " + message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
                        .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
                        .setColor("#6143CB")
                        .addField("Reason", reason)
                        .addField("Time", ms(time, { long: true }))
                        .addField("Moderator", "GiulioAndCommunity BOT")
                        .setFooter("User ID: " + message.member.user.id)

                    message.channel.send({ embeds: [embed] })
                        .then(msg => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle(":thought_balloon: Individual spam :thought_balloon:")
                                .setColor("#8227cc")
                                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                                .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
                                .addField("Channel", `#${message.channel.name}`, false)

                            if (!isMaintenance())
                                client.channels.cache.get(log.moderation.spam).send({ embeds: [embed] })

                            var embed = new Discord.MessageEmbed()
                                .setTitle(":speaker: Tempmute :speaker:")
                                .setColor("#8227cc")
                                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                                .addField(":brain: Executor", `${client.user.toString()}`, false)
                                .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
                                .addField("Duration", `${ms(time, { long: true })} (Until: ${moment(new Date().getTime()).add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                                .addField("Reason", reason, false)

                            if (!isMaintenance())
                                client.channels.cache.get(log.moderation.tempmute).send({ embeds: [embed] })
                        })

                    var embed = new Discord.MessageEmbed()
                        .setTitle("Sei stato mutato temporaneamente")
                        .setColor("#6143CB")
                        .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
                        .addField("Reason", reason)
                        .addField("Time", ms(time, { long: true }))
                        .addField("Moderator", "GiulioAndCommunity BOT")

                    message.member.send({ embeds: [embed] }).catch(() => {
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
        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats || userstats.level < 15) {
            if (usersGroupSpam.has(message.channel.id)) {
                var channel = usersGroupSpam.get(message.channel.id)
                if (message.createdTimestamp - channel.lastMessage <= 2000) {
                    channel.lastMessage = message.createdTimestamp
                    channel.msgCount++

                    if (channel.msgCount >= 10) {
                        if (!serverstats.lockdown) {
                            var embed = new Discord.MessageEmbed()
                                .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                                .setColor("#ED1C24")
                                .setThumbnail("https://i.postimg.cc/nr9Cyd46/Lockdown-ON.png")
                                .setDescription("È appena stato attivato il **sistema di lockdown** automaticamente per una rilevazione di **spam eccessivo**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
                            message.channel.send({ embeds: [embed] })
                                .then(msg => {
                                    var embed = new Discord.MessageEmbed()
                                        .setTitle(":thought_balloon: Group spam :thought_balloon:")
                                        .setColor("#8227cc")
                                        .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                                        .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                                        .addField("Channel", `#${message.channel.name}`, false)

                                    if (!isMaintenance())
                                        client.channels.cache.get(log.moderation.spam).send({ embeds: [embed] })
                                })

                            serverstats.lockdown = true;

                            var ruolo = message.guild.roles.everyone
                            ruolo.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD"])

                            var canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
                            canale.permissionOverwrites.edit(ruolo, {
                                VIEW_CHANNEL: true,
                            })
                            canale.messages.fetch("873963745938919495")
                                .then(msg => {
                                    var embed = new Discord.MessageEmbed()
                                        .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                                        .setColor("#ED1C24")
                                        .setThumbnail("https://i.postimg.cc/nr9Cyd46/Lockdown-ON.png")
                                        .setDescription(`È appena stato attivato il **sistema di lockdown** automaticamente per una rilevazione di **spam eccessivo**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${settings.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                                    msg.edit({ embeds: [embed] })
                                })

                            if (message.channel.id == settings.idCanaliServer.general) return
                            var canale = client.channels.cache.get(settings.idCanaliServer.general);
                            canale.send({ embeds: [embed] });
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
                    channelId: message.channel.id,
                    msgCount: 1,
                    lastMessage: message.createdTimestamp
                });
            }
        }
    },
};