const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json");
const settings = require("../../config/general/settings.json");
const { addUser } = require("../../functions/database/addUser");
const { getServer } = require("../../functions/database/getServer");
const { getUser } = require("../../functions/database/getUser");
const { updateServer } = require("../../functions/database/updateServer");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { replyMessage } = require("../../functions/general/replyMessage");
const { hasSufficientLevels } = require("../../functions/leveling/hasSufficientLevels");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("iscriviti")) return

        await interaction.deferUpdate().catch(() => { })

        let serverstats = await getServer()

        const event = serverstats.events.find(x => x.message == interaction.message.id)
        if (!event) {
            return replyMessage(client, interaction, "Warning", "Evento non trovato", "Questo evento non esiste più")
        }

        if (event.isFinished || event.expiration_data < new Date().getTime()) {
            return replyMessage(client, interaction, "Warning", "Iscrizioni scadute", `La data di scadenza dell'evento era il ${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}. Ora non è più possibile iscriversi`)
        }

        if (event.partecipanti.length >= event.maxpartecipanti) {
            return replyMessage(client, interaction, "Warning", "Iscrizioni al completo", `È stata raggiunto il limite di iscrizioni all'evento, non è più possibile iscriversi, altrimenti spera che qualche utente si disiscriva`)
        }

        if (event.partecipanti.find(x => x.user == interaction.user.id)) {
            return replyMessage(client, interaction, "Warning", "Sei già iscritto", `Sei già iscritto al torneo, se vuoi cancellare la tua partecipazione vai nel canale e clicca sul bottone "**Cancella iscrizione**"`)
        }

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        let button1 = new Discord.MessageButton()
            .setLabel("Iscriviti")
            .setCustomId("iscriviti")
            .setStyle("SUCCESS")

        if (event.partecipanti.length + 1 >= event.maxpartecipanti) {
            button1
                .setLabel("Iscriviti (Full)")
                .setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setLabel("Come funzionano gli eventi")
            .setCustomId("eventiTutorial")
            .setStyle("SECONDARY")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.message.edit({
            content: `
Iscriviti subito all'evento con il bottone "**Iscriviti**" qua sotto e segui le istruzioni
_Partecipa solo che hai già pronto il progetto da presentare, altrimenti attendi di terminarlo per poi consegnarlo_

:alarm_clock: Data evento: **${moment(event.data).format("DD/MM/YYYY HH:mm")}** sul canale Twitch di Giulio
:hourglass: Scadenza partecipazioni: **${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length + 1}/${event.maxpartecipanti}**
${event.partecipanti.length + 1 >= event.maxpartecipanti ? "_Partecipanti massimi raggiunti_" : ""}
`, components: [row]
        })

        interaction.guild.channels.create(`🏅│${interaction.user.username}`, {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES']
                },
                {
                    id: settings.ruoliStaff.moderatore,
                    allow: ['VIEW_CHANNEL', 'EMBED_LINKS', 'ATTACH_FILES']
                }
            ],
            parent: client.channels.cache.get(interaction.channelId).parentId
        })
            .then(async canale => {
                await interaction.deferUpdate()
                    .catch(() => { })

                let embed = new Discord.MessageEmbed()
                    .setColor(colors.orange)
                    .addFields([
                        {
                            name: ":cloud: Iscriviti solo se hai terminato il progetto",
                            value: "Iscriviti all'evento solo se hai terminato e sei pronto a rilasciare ciò che devi consegnare"
                        },
                        {
                            name: ":peace: Rispetta tutti",
                            value: "Porta rispetto per tutti i partecipanti, e non insultare chi eventualmente farà un progetto più brutto del tuo. Partecipa per partecipare, non per vincere"
                        },
                        {
                            name: ":cd: Consegna tutto il necessario",
                            value: "Segui tutte le istruzioni sottostanti per iscriverti e per consegnare tutto quello che è necessario"
                        },
                        {
                            name: ":cake: Non utilizzare oggetti già pronti",
                            value: "Non è consentito utilizzare strumenti, librerie o tool che offrano componenti (o altri elementi grafici, esluse icone e immagini) già pronti. Sono consentiti solo strumenti che facilitano lo sviluppo (come React, Vite, Svelte...)"
                        },
                        {
                            name: ":soccer: Sii sportivo",
                            value: "Non lamentarti se ricevi un punteggio minore di chi secondo te è peggio. Sappi anche perdere e non ci rimanere male"
                        },
                        {
                            name: ":wrench: Non modificare la consegna",
                            value: "Non è consentito modificare il progetto che hai consegnato dopo la fine delle iscrizioni"
                        }
                    ])

                let embed2 = new Discord.MessageEmbed()
                    .setColor(colors.red)
                    .setDescription(":exclamation: Il non rispetto di queste regole può portare alla **cancellazione** dell'iscrizione da parte dello staff")

                let button1 = new Discord.MessageButton()
                    .setLabel("Cancella iscrizione")
                    .setStyle("DANGER")
                    .setCustomId(`cancellaIscrizione,${event.message}`)

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                canale.send({ components: [row], embeds: [embed, embed2] })
                    .then((msg) => {
                        serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].partecipanti.push({
                            user: interaction.user.id,
                            channel: canale.id,
                            daEliminare: false,
                            message: msg.id,
                            chatpoints: null,
                            giuliopoints: null
                        })

                        updateServer(serverstats)

                        msg.pin().catch(() => { })
                    });

                let msg = await client.channels.cache.get(settings.idCanaliServer.testing).messages.fetch(event.istructions)
                canale.send(`
:identification_card: Segui tutte queste **istruzioni** per consegnare tutto il necessario al meglio

${msg.content}`)

                canale.send(`<@${interaction.user.id}> ecco il canale della tua iscrizione`)
                    .then((msg) => {
                        msg.delete().catch(() => { });
                    })
            })
    },
};
