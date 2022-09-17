const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getEmoji } = require("../../../functions/general/getEmoji");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("events")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[2])
        if (!event) return

        const mode = interaction.customId.split(",")[3]
        let embed = new Discord.MessageEmbed()

        let partecipanti = event.partecipanti.sort((a, b) => ((a.chatpoints + a.giuliopoints) < (b.chatpoints + b.giuliopoints)) ? 1 : (((b.chatpoints + b.giuliopoints) < (a.chatpoints + a.giuliopoints)) ? -1 : 0));
        let list = ""

        let totPage = Math.ceil(partecipanti.length / 10)
        let page = 1;

        if (mode == "overview") {
            embed
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
                            name: `:identification_card: Iscrizioni chiuse`,
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
                            name: `:hourglass: Iscrizioni aperte ${event.partecipanti.length >= event.maxpartecipanti ? "- Evento pieno" : ""}`,
                            value: `Le iscrizioni a questo evento sono attualmente **aperte**
Vai al [messaggio](https://discord.com/channels/${settings.idServer}/${settings.idCanaliServer.events}/${event.message}) dell'evento e clicca sul bottone "**Iscriviti**" per partecipare all'evento

:hourglass: Scadenza partecipazioni: **${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}/${event.maxpartecipanti}**
${event.partecipanti.length >= event.maxpartecipanti ? "_Partecipanti massimi raggiunti_" : ""}
`
                        }
                    ])
            }

        }
        else if (mode == "leaderboard") {
            embed
                .setTitle(event.name)
                .setThumbnail(event.thumbnail)


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

                    if (event.finished) {
                        list += `${utente.toString()} - ${partecipanti[i].chatpoints + partecipanti[i].giuliopoints} (${partecipanti[i].chatpoints} + ${partecipanti[i].giuliopoints})\n`

                    }
                    else if (event.started) {
                        list += `${utente.toString()} - ${partecipanti[i].giuliopoints || partecipanti[i].giuliopoints == 0 ? `### (${partecipanti[i].chatpoints} + ??)` : `### (?? + ??)`}\n`
                    }
                    else {
                        list += `${utente.toString()}\n`
                    }
                }
            }

            if (event.finished) {
                embed
                    .addFields([
                        {
                            name: ":nazar_amulet: Classifica",
                            value: list
                        }
                    ])
            }
            else if (event.started) {
                embed
                    .addFields([
                        {
                            name: ":trident: Classifica provvisoria",
                            value: `_Mancano ancora i voti di Giulio_\n${list}`
                        }
                    ])
            }
            else if (event.expired) {
                embed
                    .addFields([
                        {
                            name: ":identification_card: Partecipanti",
                            value: list
                        }
                    ])
            }
            else {
                embed
                    .addFields([
                        {
                            name: ":hourglass: Iscrizioni in corso",
                            value: `_Partecipanti non definitivi_\n${list}`
                        }
                    ])
            }

            if (totPage > 1)
                embed.setFooter({ text: `Page ${page}/${totPage}` })
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`eventLb,${interaction.user.id},${event.message},1,1`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous2"))

        let button2 = new Discord.MessageButton()
            .setCustomId(`eventLb,${interaction.user.id},${event.message},${page - 1},2`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        let button3 = new Discord.MessageButton()
            .setCustomId(`eventLb,${interaction.user.id},${event.message},${page + 1},3`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        let button4 = new Discord.MessageButton()
            .setCustomId(`eventLb,${interaction.user.id},${event.message},${totPage},4`)
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

        let button5 = new Discord.MessageButton()
            .setLabel("Overview")
            .setStyle(mode == "overview" ? "SUCCESS" : "PRIMARY")
            .setCustomId(`events,${interaction.user.id},${event.message},overview`)

        let button6 = new Discord.MessageButton()
            .setLabel("Leaderboard")
            .setStyle(mode == "leaderboard" ? "SUCCESS" : "PRIMARY")
            .setCustomId(`events,${interaction.user.id},${event.message},leaderboard`)

        const row2 = new Discord.MessageActionRow()
            .addComponents(button5)
            .addComponents(button6)

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

        const row3 = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.message.edit({ embeds: [embed], components: serverstats.events.length > 1 ? (mode == "leaderboard" && totPage > 1) ? [row, row2, row3] : [row2, row3] : (mode == "leaderboard" && totPage > 1) ? [row, row2] : [row2] })
    },
};