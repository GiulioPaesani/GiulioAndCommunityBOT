const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { getServer } = require("../../../functions/database/getServer")
const { updateServer } = require("../../../functions/database/updateServer")
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: "manage-event",
    description: "Gestire un evento della community",
    permissionLevel: 3,
    requiredLevel: 0,
    cooldown: 0,
    syntax: "/manage-event [create/set-score]",
    category: "community",
    channelsGranted: [],
    data: {
        options: [
            {
                name: "create",
                description: "Crea un evento",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "Nome dell'evento",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "description",
                        description: "Descrizione breve dell'evento",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "id_content_message",
                        description: "ID del messaggio contenente tutto il messaggio dell'evento",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "id_istructions_message",
                        description: "ID del messaggio contenente tutte le istruzioni per la consegna del progetto",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "thumbnail",
                        description: "Immagine di copertina dell'evento",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "data",
                        description: "Data e ora dell'evento (DD/MM/YYYY HH:mm)",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "expiration_data",
                        description: "Data e ora della scadenza per la partecipazione dell'evento (DD/MM/YYYY HH:mm)",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "max_partecipanti",
                        description: "Numero massimo di partecipanti all'evento",
                        type: "INTEGER",
                        required: false
                    },
                ]
            },
            {
                name: "set-score",
                description: "Impostare i punteggi dei partecipanti",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "event",
                        description: "ID dell'evento",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "user",
                        description: "Utente a cui assegnare il punteggio",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "chat_points",
                        description: "Punteggio della chat",
                        type: "INTEGER",
                        required: true
                    },
                    {
                        name: "giulio_points",
                        description: "Punteggio di Giulio",
                        type: "INTEGER",
                        required: true
                    },
                ]
            },
            {
                name: "end",
                description: "Termina un evento",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "event",
                        description: "ID dell'evento",
                        type: "STRING",
                        required: true
                    }
                ]
            },
        ]
    },
    async execute(client, interaction, comando) {

        if (interaction.options.getSubcommand() == "create") {

            const name = interaction.options.getString("name")
            const description = interaction.options.getString("description")
            const id_content_message = interaction.options.getString("id_content_message")
            const id_istructions_message = interaction.options.getString("id_istructions_message")
            const thumbnail = interaction.options.getString("thumbnail")
            const data = interaction.options.getString("data")
            const expiration_data = interaction.options.getString("expiration_data")
            const max_partecipanti = interaction.options.getInteger("max_partecipanti") || 20

            if (name.length > 256) {
                return replyMessage(client, interaction, "Warning", "Nome troppo lungo", "Puoi scrivere un nome solo fino a 256 caratteri", comando)
            }

            if (description.length > 3900) {
                return replyMessage(client, interaction, "Warning", "Descrizione troppo lungo", "Puoi scrivere una descrizione solo fino a 3900 caratteri", comando)
            }

            if (max_partecipanti < 2) {
                return replyMessage(client, interaction, "Error", "Numero partecipanti massimi non valido", "I partecipanti massimi devono essere almeno 2", comando)
            }

            const msg = await client.channels.cache.get(settings.idCanaliServer.testing).messages.fetch(id_content_message).catch(() => { })

            if (!msg) {
                return replyMessage(client, interaction, "Warning", "Messaggio contenuto non trovato", "Hai inserito un id di un messaggio contenente tutta la descrizione dell'evento non valido", comando)
            }

            if (`----- :trophy: **NEW EVENT** :trophy: -----\n${msg.content}\n<@&${settings.ruoliNotification.events}>`.length > 4000) {
                return replyMessage(client, interaction, "Warning", "Messaggio contenuto troppo lungo", `Hai inserito un messaggio lungo ${`----- :trophy: **NEW EVENT** :trophy: -----\n${msg.content}\n<@&${settings.ruoliNotification.events}>`.length} caratteri, ma il massimo è 4000`, comando)
            }

            const msg2 = await client.channels.cache.get(settings.idCanaliServer.testing).messages.fetch(id_istructions_message).catch(() => { })
            if (!msg2) {
                return replyMessage(client, interaction, "Warning", "Messaggio istruzioni non trovato", "Hai inserito un id di un messaggio contenente tutte le istruzioni dell'evento non valido", comando)
            }

            if (msg2.content.length > 3500) {
                return replyMessage(client, interaction, "Warning", "Messaggio istruzioni troppo lungo", `Hai inserito un messaggio lungo ${msg2.content.length} caratteri, ma il massimo è 3500`, comando)
            }

            if (!moment(data, "DD/MM/YYYY HH:mm").isValid()) {
                return replyMessage(client, interaction, "Error", "Data non valida", "Hai inserito una data dell'evento non valida", comando)
            }

            if (moment(data, "DD/MM/YYYY HH:mm").valueOf() <= new Date().getTime()) {
                return replyMessage(client, interaction, "Warning", "Data troppo passata", "Hai inserito una data dell'evento passata", comando)
            }

            if (!moment(expiration_data, "DD/MM/YYYY HH:mm").isValid()) {
                return replyMessage(client, interaction, "Error", "Data di scadenza non valida", "Hai inserito una data di scadenza non valida", comando)
            }

            if (moment(expiration_data, "DD/MM/YYYY HH:mm").valueOf() > moment(data, "DD/MM/YYYY HH:mm").valueOf()) {
                return replyMessage(client, interaction, "Error", "Date non valide", "Hai inserito una data di scadenza successiva alla data dell'evento", comando)
            }

            let serverstats = await getServer()
            if (serverstats.events.some(x => !x.finished)) {
                return replyMessage(client, interaction, "Warning", "Un evento già in corso", "Puoi creare un nuovo evento quando gli eventi passati saranno terminati", comando)
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("Confermi la creazione dell'evento?")
                .setColor(colors.yellow)
                .setDescription(`**${name}**
            
:alarm_clock: Data evento: **${moment(data, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}**
:hourglass: Scadenza partecipazioni: **${moment(expiration_data, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}**
            
:busts_in_silhouette: Max partecipanti: **${max_partecipanti}**
`)
                .setImage(thumbnail)

            let button1 = new Discord.MessageButton()
                .setLabel("Annulla")
                .setStyle("DANGER")
                .setCustomId("annullaEvento")

            let button2 = new Discord.MessageButton()
                .setLabel("Conferma evento")
                .setStyle("SUCCESS")
                .setCustomId("confermaEvento")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row], fetchReply: true, content: `----- :trophy: **NEW EVENT** :trophy: -----\n${msg.content}\n<@&${settings.ruoliNotification.events}>`, allowedMentions: { parse: [] } })
                .then(msg3 => {
                    const collector = msg3.createMessageComponentCollector();

                    collector.on('collect', async i => {
                        if (!i.isButton()) return
                        const maintenanceStates = await isMaintenance(i.user.id)
                        if (maintenanceStates) return

                        i.deferUpdate().catch(() => { })

                        if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                        if (i.customId == "annullaEvento") {
                            let embed = new Discord.MessageEmbed()
                                .setTitle("Evento annullato")
                                .setColor(colors.red)

                            msg3.edit({ embeds: [embed], components: [], content: "_Evento annullatto_" })
                        }
                        else if (i.customId == "confermaEvento") {
                            let embed = new Discord.MessageEmbed()
                                .setTitle("Evento creato")
                                .setColor(colors.green)
                                .setDescription(msg3.embeds[0].description)

                            msg3.edit({ embeds: [embed], components: [], content: "_Evento creato_" })

                            await client.channels.cache.get(settings.idCanaliServer.events).send({ content: `----- :trophy: **NEW EVENT** :trophy: -----\n${msg.content}\n<@&${settings.ruoliNotification.events}>`, files: [thumbnail] })
                                .then(async msg => {
                                    msg.crosspost().catch(() => { })
                                })

                            let button1 = new Discord.MessageButton()
                                .setLabel("Iscriviti")
                                .setCustomId("iscriviti")
                                .setStyle("SUCCESS")

                            let button2 = new Discord.MessageButton()
                                .setLabel("Come funzionano gli eventi")
                                .setCustomId("eventiTutorial")
                                .setStyle("SECONDARY")

                            let row = new Discord.MessageActionRow()
                                .addComponents(button1)
                                .addComponents(button2)

                            client.channels.cache.get(settings.idCanaliServer.events).send({
                                content: `
Iscriviti subito all'evento con il bottone "**Iscriviti**" qua sotto e segui le istruzioni
_Partecipa solo che hai già pronto il progetto da presentare, altrimenti attendi di terminarlo per poi consegnarlo_

:alarm_clock: Data evento: **${moment(data, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}** sul canale Twitch di Giulio
:hourglass: Scadenza partecipazioni: **${moment(expiration_data, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **0/${max_partecipanti}**
`, components: [row]
                            })
                                .then(async msg4 => {
                                    msg4.crosspost().catch(() => { })

                                    serverstats.events.push({
                                        name: name,
                                        description: description,
                                        message: msg4.id,
                                        istructions: msg2.id,
                                        data: moment(data, "DD/MM/YYYY HH:mm").valueOf(),
                                        started: false,
                                        expiration_data: moment(expiration_data, "DD/MM/YYYY HH:mm").valueOf(),
                                        expired: false,
                                        thumbnail: thumbnail,
                                        maxpartecipanti: max_partecipanti,
                                        finished: false,
                                        partecipanti: [],
                                    })

                                    updateServer(serverstats)
                                })
                        }
                    })
                })
        }
        if (interaction.options.getSubcommand() == "set-score") {
            const id_event = interaction.options.getString("event")
            let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

            const chat_points = interaction.options.getInteger("chat_points")
            const giulio_points = interaction.options.getInteger("giulio_points")

            let serverstats = await getServer()
            const event = serverstats.events.find(x => x.message == id_event)

            if (!event) {
                return replyMessage(client, interaction, "Error", "Evento non trovato", "Hai inserito l'id di un evento che non esiste", comando)
            }

            if (!event.started) {
                return replyMessage(client, interaction, "Warning", "Evento non iniziato", "L'evento non è ancora iniziato, non puoi inserire i punteggi", comando)
            }

            if (event.finished) {
                return replyMessage(client, interaction, "Warning", "Evento terminato", "Questo evento è già terminato, non puoi più modificare i punteggi", comando)
            }

            if (!utente) {
                return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
            }

            if (!event.partecipanti.find(x => x.user == utente.id)) {
                return replyMessage(client, interaction, "Warning", "Utente non iscritto", "Questo utente non è iscritto all'evento", comando)
            }

            if (chat_points < 0) {
                return replyMessage(client, interaction, "Error", "Punti chat non validi", "Hai inserito dei punti della chat non validi", comando)
            }

            if (giulio_points < 0) {
                return replyMessage(client, interaction, "Error", "Punti Giulio non validi", "Hai inserito dei punti di Giulio non validi", comando)
            }

            serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].partecipanti[event.partecipanti.findIndex(x => x.user == utente.id)].chatpoints = chat_points
            serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].partecipanti[event.partecipanti.findIndex(x => x.user == utente.id)].giuliopoints = giulio_points

            updateServer(serverstats)

            let embed = new Discord.MessageEmbed()
                .setTitle(":beginner: Assegnamento punteggio")
                .setColor(colors.yellow)
                .setDescription(`Ho inserito il punteggio per l'evento **${event.name}** a ${utente.toString()}`)
                .addFields([
                    {
                        name: ":mega: Punti chat",
                        value: chat_points.toString(),
                        inline: true
                    },
                    {
                        name: ":bust_in_silhouette: Punti Giulio",
                        value: giulio_points.toString(),
                        inline: true
                    }
                ])

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (interaction.options.getSubcommand() == "end") {
            const id_event = interaction.options.getString("event")

            let serverstats = await getServer()
            const event = serverstats.events.find(x => x.message == id_event)

            if (!event) {
                return replyMessage(client, interaction, "Error", "Evento non trovato", "Hai inserito l'id di un evento che non esiste", comando)
            }

            if (!event.started) {
                return replyMessage(client, interaction, "Warning", "Evento non iniziato", "L'evento non è ancora iniziato, non puoi terminarlo", comando)
            }

            if (event.finished) {
                return replyMessage(client, interaction, "Warning", "Evento già terminato", "L'evento è già stato terminato", comando)
            }

            if (event.partecipanti.some(x => x.chatpoints === null || x.giuliopoints === null || x.chatpoints < 0 || x.giuliopoints < 0)) {
                return replyMessage(client, interaction, "Warning", "Partecipante senza punteggio", `<@${event.partecipanti.find(x => x.chatpoints === null || x.giuliopoints === null || x.chatpoints < 0 || x.giuliopoints < 0).user}> non ha un punteggio valido inserito`, comando)
            }

            let partecipanti = event.partecipanti.sort((a, b) => ((a.chatpoints + a.giuliopoints) < (b.chatpoints + b.giuliopoints)) ? 1 : (((b.chatpoints + b.giuliopoints) < (a.chatpoints + a.giuliopoints)) ? -1 : 0));
            let list = ""

            let totPage = Math.ceil(partecipanti.length / 10)
            let page = 1;

            for (let i = 10 * (page - 1); i < 10 * page; i++) {
                if (partecipanti[i]) {
                    if (event.finished || event.started) {
                        switch (i) {
                            case 0:
                                list += ":first_place: ";
                                break
                            case 1:
                                list += ":second_place: "
                                break
                            case 2:
                                list += ":third_place: "
                                break
                            default:
                                list += `**#${i + 1}** `
                        }
                    }
                    else list += `**#${i + 1}** `

                    let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == partecipanti[i].user);

                    list += `${utente.toString()} - ${partecipanti[i].chatpoints + partecipanti[i].giuliopoints} (${partecipanti[i].chatpoints} + ${partecipanti[i].giuliopoints})\n`
                }
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("Conferma fine evento?")
                .setColor(colors.yellow)
                .setDescription("Terminando l'evento verranno mostrati tutti i voti e la classifica definitica")
                .addFields([
                    {
                        name: ":nazar_amulet: Classifica",
                        value: list
                    }
                ])

            if (totPage > 1)
                embed.setFooter({ text: `Page ${page}/${totPage}` })

            let button1 = new Discord.MessageButton()
                .setCustomId(`eventConfirmLb,${interaction.user.id},${event.message},1,1`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous2"))

            let button2 = new Discord.MessageButton()
                .setCustomId(`eventConfirmLb,${interaction.user.id},${event.message},${page - 1},2`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) {
                button1.setDisabled()
                button2.setDisabled()
            }

            let button3 = new Discord.MessageButton()
                .setCustomId(`eventConfirmLb,${interaction.user.id},${event.message},${page + 1},3`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            let button4 = new Discord.MessageButton()
                .setCustomId(`eventConfirmLb,${interaction.user.id},${event.message},${totPage},4`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next2"))

            if (page == totPage) {
                button3.setDisabled()
                button4.setDisabled()
            }

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)
                .addComponents(button3)
                .addComponents(button4)

            let button6 = new Discord.MessageButton()
                .setLabel("Annulla")
                .setCustomId(`annullaTerminaEvento,${interaction.user.id},${event.message}`)
                .setStyle("DANGER")

            let button7 = new Discord.MessageButton()
                .setLabel("Conferma termine evento")
                .setCustomId(`confermaTerminaEvento,${interaction.user.id},${event.message}`)
                .setStyle("SUCCESS")

            let row2 = new Discord.MessageActionRow()
                .addComponents(button6)
                .addComponents(button7)

            interaction.reply({ embeds: [embed], components: totPage > 1 ? [row, row2] : [row2] })
        }
    }
};