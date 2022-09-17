const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("cancellaIscrizione")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[1])
        if (!event) return

        let button1 = new Discord.MessageButton()
            .setLabel("In eliminazione...")
            .setStyle("DANGER")
            .setCustomId("cancellaIscrizione")
            .setDisabled()

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.message.edit({
            embeds: interaction.message.embeds,
            components: [row]
        })

        let embed = new Discord.MessageEmbed()
            .setTitle("Iscrizione in eliminazione...")
            .setColor(colors.red)
            .setDescription(`L'iscrizione si cancellerà tra \`30 secondi\``)

        button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaCancellazioneIscrizione,${event.message}`)

        row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.message.channel.send({ embeds: [embed], components: [row] })
            .then(async msg => {
                serverstats.events[serverstats.events.findIndex(x => x.message == interaction.customId.split(",")[1])].partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)].daEliminare = true;
                updateServer(serverstats)

                setTimeout(async function () {
                    serverstats = await getServer()
                    let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[1])

                    if (event?.partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)]?.daEliminare) {
                        embed.setDescription("L'iscrizione si cancellerà tra `20 secondi`")
                        msg.edit({ embeds: [embed] })

                        setTimeout(async function () {
                            serverstats = await getServer()
                            let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[1])

                            if (event?.partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)]?.daEliminare) {
                                embed.setDescription("L'iscrizione si cancellerà tra `10 secondi`")
                                msg.edit({ embeds: [embed] })

                                setTimeout(async function () {
                                    serverstats = await getServer()
                                    let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[1])
                                    if (event?.partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)]?.daEliminare && msg.description != "Questa iscrizione non si cancellerà più") {

                                        embed.setDescription("L'iscrizione si sta per cancellare")
                                        msg.edit({ embeds: [embed] })


                                        interaction.message.channel.delete()
                                            .catch(() => { });

                                        const msg2 = await client.channels.cache.get(settings.idCanaliServer.events).messages.fetch(event.message)

                                        if (!event.expired) {
                                            let button1 = new Discord.MessageButton()
                                                .setLabel("Iscriviti")
                                                .setCustomId("iscriviti")
                                                .setStyle("SUCCESS")

                                            if (event.partecipanti.length - 1 >= event.maxpartecipanti) {
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

                                            msg2.edit({
                                                content: `
Iscriviti subito all'evento con il bottone "**Iscriviti**" qua sotto e segui le istruzioni
_Partecipa solo che hai già pronto il progetto da presentare, altrimenti attendi di terminarlo per poi consegnarlo_

:alarm_clock: Data evento: **${moment(event.data).format("DD/MM/YYYY HH:mm")}** sul canale Twitch di Giulio
:hourglass: Scadenza partecipazioni: **${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}**

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length - 1}/${event.maxpartecipanti}**
${event.partecipanti.length - 1 >= event.maxpartecipanti ? "_Partecipanti massimi raggiunti_" : ""}
`, components: [row]
                                            })
                                        }
                                        else {
                                            msg2.edit({
                                                content: `
:no_entry_sign: Il tempo per iscriversi e partecipare all'evento è **terminato**
Ora siate pronti e attendete la data dell'evento per **divertirsi** assieme e scoprire il **vincitore**

:alarm_clock: Data evento: **${moment(event.data).format("DD/MM/YYYY HH:mm")}** sul canale Twitch di Giulio

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length - 1}/${event.maxpartecipanti}**
_Le iscrizioni sono state chiuse il ${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}_
`
                                            })
                                        }

                                        serverstats.events[serverstats.events.findIndex(x => x.message == interaction.customId.split(",")[1])].partecipanti = serverstats.events[serverstats.events.findIndex(x => x.message == interaction.customId.split(",")[1])].partecipanti.filter(x => x.channel != interaction.channelId)

                                        updateServer(serverstats)
                                    }
                                    else return
                                }, 10000);
                            }
                            else return
                        }, 10000);
                    }
                    else return
                }, 10000);
            })
    },
};