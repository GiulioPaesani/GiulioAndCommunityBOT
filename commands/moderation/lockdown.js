module.exports = {
    name: "lockdown",
    aliases: ["lock"],
    onlyStaff: true,
    availableOnDM: true,
    description: "Abilitare/Disabilitare il sistema di blocco nel server",
    syntax: "!lockdown (state)",
    category: "moderation",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var ruolo = message.guild.roles.everyone

        if (!args[0]) {
            if (!serverstats.lockdown) {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                    .setColor("#ED1C24")
                    .setThumbnail("https://i.postimg.cc/nr9Cyd46/Lockdown-ON.png")
                    .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
                message.channel.send({ embeds: [embed] })

                serverstats.lockdown = true;

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
                            .setDescription(`È stato attivato il **sistema di lockdown** di questo server per evitare un possibile **raid** o **situazioni gravi**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${settings.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                        msg.edit({ embeds: [embed] })
                    })

                if (message.channel.id == settings.idCanaliServer.general) return
                var canale = client.channels.cache.get(settings.idCanaliServer.general);
                canale.send({ embeds: [embed] });
            }
            else {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                    .setColor("#77B155")
                    .setThumbnail("https://i.postimg.cc/NfkvH4wF/Lockdown-OFF.png")
                    .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti possono continuare a partecipare nel server")
                message.channel.send({ embeds: [embed] })

                ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])

                serverstats.lockdown = false;

                var canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
                canale.permissionOverwrites.edit(ruolo, {
                    VIEW_CHANNEL: false,
                })
                canale.messages.fetch("873963745938919495")
                    .then(msg => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                            .setColor("#77B155")
                            .setThumbnail("https://i.postimg.cc/NfkvH4wF/Lockdown-OFF.png")
                            .setDescription(`Il **sistema di lockdown** è ora disattivato, tutti i pericoli sono stati scampati. Potete ritornare a **scrivere** e divertirvi all'interno del server`)

                        msg.edit({ embeds: [embed] })
                    })

                if (message.channel.id == settings.idCanaliServer.general) return
                var canale = client.channels.cache.get(settings.idCanaliServer.general);
                canale.send({ embeds: [embed] });
            }
        }
        else {
            if (args[0] == "on" || args[0] == "true" || args[0] == "attivo" || args[0] == "attiva" || args[0] == "attivare" || args[0] == "attivato" || args[0] == "spento") {
                if (serverstats.lockdown) {
                    return botCommandMessage(message, "Warning", "Lockdown già attivato", "Il sistema di lockdown è già attivo")
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                    .setColor("#ED1C24")
                    .setThumbnail("https://i.postimg.cc/nr9Cyd46/Lockdown-ON.png")
                    .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
                message.channel.send({ embeds: [embed] })

                serverstats.lockdown = true;

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
                            .setDescription(`È stato attivato il **sistema di lockdown** di questo server per evitare un possibile **raid** o **situazioni gravi**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${settings.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                        msg.edit({ embeds: [embed] })
                    })

                if (message.channel.id == settings.idCanaliServer.general) return
                var canale = client.channels.cache.get(settings.idCanaliServer.general);
                canale.send({ embeds: [embed] });
            }
            else if (args[0] == "off" || args[0] == "false" || args[0] == "disattivo" || args[0] == "disattiva" || args[0] == "disattivare" || args[0] == "disattivato") {
                if (!serverstats.lockdown) {
                    return botCommandMessage(message, "Warning", "Lockdown già disattivato", "Il sistema di lockdown è già disattivo")
                }

                var embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                    .setColor("#77B155")
                    .setThumbnail("https://i.postimg.cc/NfkvH4wF/Lockdown-OFF.png")
                    .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti possono continuare a partecipare nel server")
                message.channel.send({ embeds: [embed] })

                ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])

                serverstats.lockdown = false;

                var canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
                canale.permissionOverwrites.edit(ruolo, {
                    VIEW_CHANNEL: false,
                })
                canale.messages.fetch("873963745938919495")
                    .then(msg => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                            .setColor("#77B155")
                            .setThumbnail("https://i.postimg.cc/NfkvH4wF/Lockdown-OFF.png")
                            .setDescription(`Il **sistema di lockdown** è ora disattivato, tutti i pericoli sono stati scampati. Potete ritornare a **scrivere** e divertirvi all'interno del server`)

                        msg.edit({ embeds: [embed] })
                    })

                if (message.channel.id == settings.idCanaliServer.general) return
                var canale = client.channels.cache.get(settings.idCanaliServer.general);
                canale.send({ embeds: [embed] });
            }
        }

    },
};