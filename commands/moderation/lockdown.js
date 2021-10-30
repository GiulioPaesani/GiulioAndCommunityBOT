module.exports = {
    name: "lockdown",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        let ruolo = message.guild.roles.everyone

        if (!args[0]) {
            if (!serverstats.lockdown) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                    .setColor("#ED1C24")
                    .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
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
                            .setDescription(`È stato attivato il **sistema di lockdown** di questo server per evitare un possibile **raid** o **situazioni gravi**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${config.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                        msg.edit(embed)
                    })

                if (message.channel.id == config.idCanaliServer.general) return
                var canale = client.channels.cache.get(config.idCanaliServer.general);
                canale.send(embed);
            }
            else {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                    .setColor("#77B155")
                    .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti possono continuare a partecipare nel server")
                message.channel.send(embed)

                ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])

                serverstats.lockdown = false;

                var canale = client.channels.cache.get(config.idCanaliServer.lockdown);
                canale.updateOverwrite(ruolo, {
                    VIEW_CHANNEL: false,
                })
                canale.messages.fetch("873963745938919495")
                    .then(msg => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                            .setColor("#77B155")
                            .setDescription(`Il **sistema di lockdown** è ora disattivato`)

                        msg.edit(embed)
                    })

                if (message.channel.id == config.idCanaliServer.general) return
                var canale = client.channels.cache.get(config.idCanaliServer.general);
                canale.send(embed);
            }
        }
        else {
            if (args[0] == "on" || args[0] == "true" || args[0] == "attivo" || args[0] == "attiva" || args[0] == "attivare" || args[0] == "attivato" || args[0] == "spento") {
                if (serverstats.lockdown) {
                    warning(message, "Lockdown già ATTIVATO", "Il **sistema di lockdown** è già stato attivato")
                }

                let embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN ATTIVATO :skull:")
                    .setColor("#ED1C24")
                    .setDescription("È appena stato attivato il **sistema di lockdown**\n\nTutti gli utenti con **livello inferiore o uguale a 10** non vedranno piu nessun canale fino alla disattivazione di questo sistema")
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
                            .setDescription(`È stato attivato il **sistema di lockdown** di questo server per evitare un possibile **raid** o **situazioni gravi**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il <@&${config.ruoliLeveling.level10}> non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)

                        msg.edit(embed)
                    })

                if (message.channel.id == config.idCanaliServer.general) return
                var canale = client.channels.cache.get(config.idCanaliServer.general);
                canale.send(embed);
            }
            else if (args[0] == "off" || args[0] == "false" || args[0] == "disattivo" || args[0] == "disattiva" || args[0] == "disattivare" || args[0] == "disattivato") {
                if (!serverstats.lockdown) {
                    warning(message, "Lockdown già DISATTIVATO", "Il **sistema di lockdown** è già stato disattivato")
                }

                let embed = new Discord.MessageEmbed()
                    .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                    .setColor("#77B155")
                    .setDescription("È appena stato disattivato il **sistema di lockdown**\n\nTutti gli utenti possono continuare a partecipare nel server")
                message.channel.send(embed)

                ruolo.setPermissions(["SEND_MESSAGES", "VIEW_CHANNEL", "CREATE_INSTANT_INVITE", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK", "USE_VAD"])

                serverstats.lockdown = false;

                var canale = client.channels.cache.get(config.idCanaliServer.lockdown);
                canale.updateOverwrite(ruolo, {
                    VIEW_CHANNEL: false,
                })
                canale.messages.fetch("873963745938919495")
                    .then(msg => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":skull: LOCKDOWN DISATTIVATO :skull:")
                            .setColor("#77B155")
                            .setDescription(`Il **sistema di lockdown** è ora disattivato`)

                        msg.edit(embed)
                    })

                if (message.channel.id == config.idCanaliServer.general) return
                var canale = client.channels.cache.get(config.idCanaliServer.general);
                canale.send(embed);
            }
        }

    },
};