const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { replyMessage } = require("../../functions/general/replyMessage");
const { getServer } = require("../../functions/database/getServer");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("menuEvents")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Menu non tuo", "Questo menu è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.values[0])
        if (!event) return

        let embed = new Discord.MessageEmbed()
            .setTitle(event.name)
            .setImage(event.thumbnail)
            .setDescription(`${event.description}
        
:alarm_clock: Data evento: **${moment(event.data).format("DD/MM/YYYY HH:mm")}**`)

        if (event.finished) {
            let winner;
            event.partecipanti.forEach(partecipante => {
                if ((partecipante.chatpoints && partecipante.giuliopoints) && (!winner || (winner.chatpoints + winner.giuliopoints) < (partecipante.chatpoints + partecipante.giuliopoints))) winner = partecipante
            })

            embed
                .addFields([
                    {
                        name: `:nazar_amulet: Evento terminato`,
                        value: `L'evento è **finito**!
**Riguarda** la live su [Twitch](https://twitch.tv/giulioandcode) o su [GiulioAndLive](https://www.youtube.com/channel/UCdwJnxZFfggSuXrLrc5sfPg) per scoprire l'intero evento

:first_place: Il VINCITORE è ${winner ? `<@${winner.user}> con **${winner.chatpoints + winner.giuliopoints} punti**` : "###"}

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
`
                    }
                ])
        }
        else if (event.started) {
            embed
                .setColor(colors.purple)
                .addFields([
                    {
                        name: `:trident: Evento in corso...`,
                        value: `L'evento è **iniziato**!
Vieni in **live** sul canale Twitch di Giulio per scoprire tutti i partecipanti e **votare** insieme alla chat
<https://twitch.tv/giulioandcode>

Uno per volta si voterrano tutti i partecipanti, attraverso il **voto** della chat e di Giulio, che rimarrà **segreto** fino alla fine
Vai in "**Leaderboard**" nella **classifica provvisoria** per scoprire in diretta i punti scelti dalla chat e successivamente i punti di Giulio

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
`
                    }
                ])
        }
        else if (event.expired) {
            embed
                .setColor(colors.green)
                .addFields([
                    {
                        name: `:hourglass: Iscrizioni chiuse`,
                        value: `Le iscrizioni a questo evento sono attualmente **chiuse**, non è più possibile partecipare

Attendete ora l'inizio dell'evento per **partecipare**, divertirsi assieme e **votare** i progetti migliori

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
_Le iscrizioni sono state chiuse il ${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}_
`
                    }
                ])
        }
        else {
            embed
                .setColor(colors.yellow)
                .addFields([
                    {
                        name: `:identification_card: Iscrizioni aperte ${event.partecipanti.length >= event.maxpartecipanti ? "- Evento pieno" : ""}`,
                        value: `Le iscrizioni a questo evento sono attualmente **aperte**
Vai al [messaggio](https://discord.com/channels/${settings.idServer}/${settings.idCanaliServer.events}/${event.message}) dell'evento e clicca sul bottone "**Iscriviti**" per partecipare all'evento

:hourglass: Scadenza partecipazioni: **${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}/${event.maxpartecipanti}**
${event.partecipanti.length >= event.maxpartecipanti ? "_Partecipanti massimi raggiunti_" : ""}
`
                    }
                ])
        }

        let button1 = new Discord.MessageButton()
            .setLabel("Overview")
            .setStyle("SUCCESS")
            .setCustomId(`events,${interaction.user.id},${event.message},overview`)

        let button2 = new Discord.MessageButton()
            .setLabel("Leaderboard")
            .setStyle("PRIMARY")
            .setCustomId(`events,${interaction.user.id},${event.message},leaderboard`)

        const row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`menuEvents,${interaction.user.id}`)
            .setPlaceholder('Select an event...')
            .setMaxValues(1)
            .setMinValues(1)

        serverstats.events.reverse().slice(0, 25).forEach(event => {
            select.addOptions({
                label: `${event.name.length > 87 ? `${event.name.slice(0, 84)}...` : event.name} - ${moment(event.data).format("DD/MM/YYYY")}`,
                value: event.message
            })
        })

        const row2 = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.message.edit({ embeds: [embed], components: [row, row2] })
    },
};