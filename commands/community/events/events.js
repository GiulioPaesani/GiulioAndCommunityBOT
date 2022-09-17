const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");
const { getServer } = require("../../../functions/database/getServer");

module.exports = {
    name: "events",
    description: "Visualizzare tutti le informazioni degli eventi della community",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/events",
    category: "community",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let serverstats = await getServer()

        const lastEvent = serverstats.events[serverstats.events.length - 1]

        if (!lastEvent) {
            let embed = new Discord.MessageEmbed()
                .setTitle(":trophy: Community Events :trophy:")
                .setColor(colors.orange)
                .setDescription("Eventi sulla programmazione con la community per divertirsi tutti insieme")
                .addFields([
                    {
                        name: "###",
                        value: "_Nessun evento in programma al momento_"
                    }
                ])

            interaction.reply({ embeds: [embed] })
            return
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(lastEvent.name)
            .setImage(lastEvent.thumbnail)
            .setDescription(`${lastEvent.description}
            
:alarm_clock: Data evento: **${moment(lastEvent.data).format("DD/MM/YYYY HH:mm")}**`)

        if (lastEvent.finished) {
            let winner;
            lastEvent.partecipanti.forEach(partecipante => {
                if ((partecipante.chatpoints && partecipante.giuliopoints) && (!winner || (winner.chatpoints + winner.giuliopoints) < (partecipante.chatpoints + partecipante.giuliopoints))) winner = partecipante
            })

            embed
                .addFields([
                    {
                        name: `:nazar_amulet: Evento terminato`,
                        value: `L'evento è **finito**!
**Riguarda** la live su [Twitch](https://twitch.tv/giulioandcode) o su [GiulioAndLive](https://www.youtube.com/channel/UCdwJnxZFfggSuXrLrc5sfPg) per scoprire l'intero evento

:first_place: Il VINCITORE è ${winner ? `<@${winner.user}> con **${winner.chatpoints + winner.giuliopoints} punti**` : "###"}

:busts_in_silhouette: Partecipanti: **${lastEvent.partecipanti.length}**
`
                    }
                ])
        }
        else if (lastEvent.started) {
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

:busts_in_silhouette: Partecipanti: **${lastEvent.partecipanti.length}**
`
                    }
                ])
        }
        else if (lastEvent.expired) {
            embed
                .setColor(colors.green)
                .addFields([
                    {
                        name: `:hourglass: Iscrizioni chiuse`,
                        value: `Le iscrizioni a questo evento sono attualmente **chiuse**, non è più possibile partecipare

Attendete ora l'inizio dell'evento per **partecipare**, divertirsi assieme e **votare** i progetti migliori

:busts_in_silhouette: Partecipanti: **${lastEvent.partecipanti.length}**
_Le iscrizioni sono state chiuse il ${moment(lastEvent.expiration_data).format("DD/MM/YYYY HH:mm")}_
`
                    }
                ])
        }
        else {
            embed
                .setColor(colors.yellow)
                .addFields([
                    {
                        name: `:identification_card: Iscrizioni aperte ${lastEvent.partecipanti.length >= lastEvent.maxpartecipanti ? "- Evento pieno" : ""}`,
                        value: `Le iscrizioni a questo evento sono attualmente **aperte**
Vai al [messaggio](https://discord.com/channels/${settings.idServer}/${settings.idCanaliServer.events}/${lastEvent.message}) dell'evento e clicca sul bottone "**Iscriviti**" per partecipare all'evento

:hourglass: Scadenza partecipazioni: **${moment(lastEvent.expiration_data).format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **${lastEvent.partecipanti.length}/${lastEvent.maxpartecipanti}**
${lastEvent.partecipanti.length >= lastEvent.maxpartecipanti ? "_Partecipanti massimi raggiunti_" : ""}
`
                    }
                ])
        }

        let button1 = new Discord.MessageButton()
            .setLabel("Overview")
            .setStyle("SUCCESS")
            .setCustomId(`events,${interaction.user.id},${lastEvent.message},overview`)

        let button2 = new Discord.MessageButton()
            .setLabel("Leaderboard")
            .setStyle("PRIMARY")
            .setCustomId(`events,${interaction.user.id},${lastEvent.message},leaderboard`)

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
                label: `${event.name.length > 87 ? `${event.name.slice(0, 84)}...` : event.name} - ${moment(lastEvent.data).format("DD/MM/YYYY")}`,
                value: event.message
            })
        })

        const row2 = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.reply({ embeds: [embed], components: serverstats.events.length > 1 ? [row, row2] : [row] })


    }
};