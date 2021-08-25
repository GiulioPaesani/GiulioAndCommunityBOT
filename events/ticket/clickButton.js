const Discord = require("discord.js");

const disbut = require('discord-buttons')(client);
const { MessageButton } = require('discord-buttons');
const { MessageActionRow } = require('discord-buttons')

module.exports = {
    name: `clickButton`,
    async execute(button) {
        button.reply.defer()
        var bottone = button

        const { database, db } = await getDatabase()
        await database.collection("serverstats").find().toArray(async function (err, result) {
            if (err) return codeError(err);
            var serverstats = result[0];

            if (bottone.id == "apriTicket") {
                var ticket = serverstats.ticket

                if (bottone.channel.id == config.idCanaliServer.staffHelp) {
                    if (ticket.find(x => x.type == "Normal" && x.owner == bottone.clicker.user.id)) {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Ticket già aperto")
                            .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                            .setColor("#8F8F8F")
                            .setDescription(`Puoi aprire un solo ticket di supporto alla volta\rHai gia un ticket aperto in <#${ticket.find(x => x.type == "Normal" && x.owner == bottone.clicker.user.id).channel}>`)

                        bottone.clicker.user.send(embed).catch();
                        return
                    }

                    var server = client.guilds.cache.get(config.idServer);
                    server.channels.create(`ticket-${bottone.clicker.user.username}`, {
                        type: "text",
                        permissionOverwrites: [
                            {
                                id: server.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: bottone.clicker.user.id,
                                allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                            },
                            {
                                id: config.idRuoloAiutante,
                                allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                            },
                            {
                                id: config.idRuoloAiutanteInProva,
                                allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                            }
                        ],
                        parent: "869975169672826940"
                    }).then((canale) => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Ticket aperto")
                            .setColor("#4b9afa")
                            .setDescription("In questa chat potrai richiedere **supporto privato** allo staff\rSe vuoi far arrivare **subito** il messaggio ai mod clicca sul button \"Tagga staff\"")

                        let button1 = new MessageButton()
                            .setLabel("Chiudi ticket")
                            .setStyle("red")
                            .setID("chiudiTicket")

                        let button2 = new MessageButton()
                            .setLabel("Tagga staff")
                            .setStyle("blurple")
                            .setID("taggaStaff")

                        let row = new MessageActionRow()
                            .addComponent(button1)
                            .addComponent(button2);

                        canale.send({
                            component: row,
                            embed: embed
                        }).then(msg => {
                            ticket.push({
                                "type": "Normal",
                                "channel": canale.id,
                                "owner": bottone.clicker.user.id,
                                "modTaggati": false,
                                "message": msg.id,
                                "daEliminare": false
                            })
                            serverstats.ticket = ticket;
                            await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        })

                        canale.send(`<@${bottone.clicker.user.id}> ecco il tuo ticket\r`)
                            .then(msg => {
                                msg.delete();
                            })
                    })
                }
                if (bottone.channel.id == config.idCanaliServer.mutedTicket || bottone.channel.id == config.idCanaliServer.tempmutedTicket || bottone.channel.id == config.idCanaliServer.bannedTicket || bottone.channel.id == config.idCanaliServer.tempbannedTicket) {
                    if (ticket.find(x => x.type == "Moderation" && x.owner == bottone.clicker.user.id)) {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Ticket già aperto")
                            .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                            .setColor("#8F8F8F")
                            .setDescription(`Puoi aprire un solo ticket di moderazione alla volta\rHai gia un ticket aperto in <#${ticket.find(x => x.type == "Moderation" && x.owner == bottone.clicker.user.id).channel}>`)

                        bottone.clicker.user.send(embed).catch();
                        return
                    }

                    var server = client.guilds.cache.get(config.idServer);
                    server.channels.create(`${bottone.clicker.user.username}`, {
                        type: "text",
                        permissionOverwrites: [
                            {
                                id: server.id,
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: bottone.clicker.user.id,
                                allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES', 'USE_EXTERNAL_EMOJIS'],
                            }
                        ],
                        parent: "834312240349184031"
                    }).then((canale) => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle("Segnalazione aperta")
                            .setColor("#6143CB")
                            .setDescription("In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione")

                        let button1 = new MessageButton()
                            .setLabel("Chiudi ticket")
                            .setStyle("red")
                            .setID("chiudiTicket")

                        let button2 = new MessageButton()
                            .setLabel("Tagga staff")
                            .setStyle("blurple")
                            .setID("taggaStaff")

                        let row = new MessageActionRow()
                            .addComponent(button1)
                            .addComponent(button2);

                        canale.send({
                            component: row,
                            embed: embed
                        }).then(msg => {
                            ticket.push({
                                "type": "Moderation",
                                "channel": canale.id,
                                "owner": bottone.clicker.user.id,
                                "modTaggati": false,
                                "message": msg.id,
                                "daEliminare": false
                            })
                            serverstats.ticket = ticket;
                            await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        })

                        canale.send(`<@${bottone.clicker.user.id}> ecco il tuo ticket\r`)
                            .then(msg => {
                                msg.delete();
                            })
                    })
                }
            }

            if (bottone.id == "taggaStaff") {
                var index = serverstats.ticket.findIndex(x => x.channel == bottone.channel.id);
                var ticket = serverstats.ticket[index];

                if (ticket.modTaggati) return

                if (ticket.owner != bottone.clicker.user.id) return

                if (ticket.type == "Normal") {
                    bottone.channel.send(`Dai venite ad aiutare <@${ticket.owner}> nel suo ticket`)
                    bottone.channel.send(`<@&${config.ruoliStaff.admin}> <@&${config.ruoliStaff.moderatore}> <@&${config.idRuoloAiutante}> <@&${config.idRuoloAiutanteInProva}>`)
                        .then(msg => msg.delete({ timeout: 500 }))

                    client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                        .then(msg => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Ticket aperto")
                                .setColor("#4b9afa")
                                .setDescription("In questa chat potrai richiedere **supporto privato** allo staff")

                            let button1 = new MessageButton()
                                .setLabel("Chiudi ticket")
                                .setStyle("red")
                                .setID("chiudiTicket")

                            let row = new MessageActionRow()
                                .addComponent(button1)

                            msg.edit({
                                component: row,
                                embed: embed
                            })

                            ticket.modTaggati = true;
                            serverstats.ticket[index] = ticket;
                            await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        })
                }
                if (ticket.type == "Moderation") {
                    bottone.channel.send(`Dai venite a rispondere a <@${ticket.owner}> nel suo ticket`)
                    bottone.channel.send(`<@&${config.ruoliStaff.admin}> <@&${config.ruoliStaff.moderatore}>`)
                        .then(msg => msg.delete({ timeout: 500 }))

                    client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                        .then(msg => {
                            var embed = new Discord.MessageEmbed()
                                .setTitle("Segnalazione aperta")
                                .setColor("#6143CB")
                                .setDescription(`In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione`)

                            let button1 = new MessageButton()
                                .setLabel("Chiudi ticket")
                                .setStyle("red")
                                .setID("chiudiTicket")

                            let row = new MessageActionRow()
                                .addComponent(button1)

                            msg.edit({
                                component: row,
                                embed: embed
                            })

                            ticket.modTaggati = true;
                            serverstats.ticket[index] = ticket;
                            await database.collection("serverstats").updateOne({}, { $set: serverstats });
                        })
                }
            }

            if (bottone.id == "chiudiTicket") {
                var index = serverstats.ticket.findIndex(x => x.channel == bottone.channel.id);
                var ticket = serverstats.ticket[index];

                if (!utenteMod(bottone.clicker.member) && bottone.clicker.user.id != ticket.owner && !bottone.clicker.member.roles.cache.has(config.idRuoloAiutante) && !bottone.clicker.member.roles.cache.has(config.idRuoloAiutanteInProva)) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle("Non hai il permesso")
                        .setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
                        .setColor("#9E005D")
                        .setDescription("Hai il permesso di chiudere questo ticket")

                    bottone.clicker.user.send(embed)
                    return
                }
                else {
                    client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                        .then(msg => {
                            if (ticket.type == "Normal") {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle("Ticket aperto")
                                    .setColor("#4b9afa")
                                    .setDescription("In questa chat potrai richiedere **supporto privato** allo staff")
                            }
                            if (ticket.type == "Moderation") {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle("Segnalazione aperta")
                                    .setColor("#6143CB")
                                    .setDescription("In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione")
                            }

                            msg.edit({
                                component: null,
                                embed: embed
                            });
                        })

                    var embed = new Discord.MessageEmbed()
                        .setTitle("Ticket in eliminazione")
                        .setThumbnail("https://i.postimg.cc/SRpBjMg8/Giulio.png")
                        .setColor("#16A0F4")
                        .setDescription("Questo ticket si cancellerà tra 10 secondi")

                    var button = new MessageButton()
                        .setLabel("Annulla")
                        .setStyle("red")
                        .setID("annullaChiusura")

                    bottone.channel.send({
                        component: button,
                        embed: embed
                    });

                    ticket.daEliminare = true;
                    serverstats.ticket[serverstats.ticket.findIndex(x => x.channel == ticket.channel)] = ticket
                    await database.collection("serverstats").updateOne({}, { $set: serverstats });

                    var idCanale = ticket.channel;
                    setTimeout(async function () {
                        await database.collection("serverstats").find().toArray(async function (err, result) {
                            if (err) return codeError(err);
                            var serverstats = result[0];

                            var ticket = serverstats.ticket.find(x => x.channel == idCanale);
                            if (!ticket) return

                            if (ticket.daEliminare) {
                                bottone.channel.delete()
                                serverstats.ticket = serverstats.ticket.filter(x => x.channel != ticket.channel)
                                await database.collection("serverstats").updateOne({}, { $set: serverstats });
                            }

                        })
                    }, 10000)
                }
            }

            if (bottone.id == "annullaChiusura") {
                var index = serverstats.ticket.findIndex(x => x.channel == bottone.channel.id);
                var ticket = serverstats.ticket[index];

                if (ticket.daEliminare) {
                    ticket.daEliminare = false;
                    serverstats.ticket[index] = ticket;
                    await database.collection("serverstats").updateOne({}, { $set: serverstats });
                    bottone.message.delete()

                    client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                        .then(msg => {
                            if (ticket.type == "Normal") {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle("Ticket aperto")
                                    .setColor("#4b9afa")
                                    .setDescription("In questa chat potrai richiedere **supporto privato** allo staff")
                            }
                            if (ticket.type == "Moderation") {
                                var embed = new Discord.MessageEmbed()
                                    .setTitle("Segnalazione aperta")
                                    .setColor("#6143CB")
                                    .setDescription("In questa chat potrai segnalare o richiedere supporto allo staff per la tua moderazione")
                            }

                            let button1 = new MessageButton()
                                .setLabel("Chiudi ticket")
                                .setStyle("red")
                                .setID("chiudiTicket")

                            let button2 = new MessageButton()
                                .setLabel("Tagga staff")
                                .setStyle("blurple")
                                .setID("taggaStaff")

                            let row = new MessageActionRow()
                                .addComponent(button1)

                            if (!ticket.modTaggati)
                                row.addComponent(button2);

                            msg.edit({
                                component: row,
                                embed: embed
                            });
                        })
                }
            }
            await db.close()
        })
    },
};