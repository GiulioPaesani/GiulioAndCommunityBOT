const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json");
const settings = require("../../../config/general/settings.json");
const { addUser } = require("../../../functions/database/addUser");
const { getServer } = require("../../../functions/database/getServer");
const { getUser } = require("../../../functions/database/getUser");
const { updateServer } = require("../../../functions/database/updateServer");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("iscriviti")) return

        // await interaction.deferUpdate().catch(() => { })

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

        let embed = new Discord.MessageEmbed()
            .setDescription("Segui queste regole prima di iscriverti al torneo")
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

        let button1 = new Discord.MessageButton()
            .setLabel("Partecipa all'evento")
            .setCustomId(`confermaIscriviti,${event.message}`)
            .setStyle("SUCCESS")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        })
    },
};
