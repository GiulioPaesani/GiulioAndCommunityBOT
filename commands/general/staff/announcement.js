const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: "announcement",
    description: "Creare un annuncio",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/announcement [type] [message]",
    category: "general",
    data: {
        options: [
            {
                name: "type",
                description: "Tipo di annuncio da creare",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "📢 Announcement",
                        value: "announcement"
                    },
                    {
                        name: "📹 Youtube Video",
                        value: "announcement"
                    },
                    {
                        name: "🟣 Twitch Live",
                        value: "live"
                    },
                    {
                        name: "🏆 Events",
                        value: "events"
                    },

                ]
            },
            {
                name: "message",
                description: "ID messaggio con il contenuto dell'annuncio",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        client.channels.cache.get(interaction.channelId).messages.fetch(interaction.options.getString("message"))
            .then(async msg => {
                if (!msg || !msg.content) {
                    return replyMessage(client, interaction, "Error", "Messaggio non trovato", "Inserisci l'ID di un messaggio valido", comando)
                }

                let type = interaction.options.getString("type")
                let title = type == "announcement" ? "----- :loudspeaker: **ANNOUNCEMENT** :loudspeaker: -----" : type == "video" ? "----- :video_camera: **NEW VIDEO** :video_camera: -----" : type == "live" ? "---- 🟣 **NEW LIVE** 🟣 -----" : type == "events" ? "----- :trophy: **NEW EVENT** :trophy: -----" : ""
                let role = type == "announcement" ? settings.ruoliNotification.announcements : type == "video" ? settings.ruoliNotification.video : type == "live" ? settings.ruoliNotification.live : type == "events" ? settings.ruoliNotification.events : ""
                let channel = type == "announcement" ? settings.idCanaliServer.announcements : type == "video" ? settings.idCanaliServer.youtubeNotification : type == "live" ? settings.idCanaliServer.liveNotification : type == "events" ? settings.idCanaliServer.events : ""

                if (`${title}\n${msg.content}\n<@&${role}>`.length > 4000) {
                    return replyMessage(client, interaction, "Warning", "Messaggio troppo lungo", `L'annuncio è lungo ${`${title}\n${msg.content}\n<@&${role}>`.length} caratteri ma è possibile inviare al massimo 4000 caratteri`, comando)
                }

                let embed = new Discord.MessageEmbed()
                    .setTitle("Confermi la creazione dell'annuncio?")
                    .setColor(colors.yellow)
                    .setDescription(`L'annuncio di tipo \`${type}\` verrà inviato in <#${channel}>`)

                let button1 = new Discord.MessageButton()
                    .setLabel("Annulla")
                    .setStyle("DANGER")
                    .setCustomId("annullaAnnuncio")

                let button2 = new Discord.MessageButton()
                    .setLabel("Conferma annuncio")
                    .setStyle("SUCCESS")
                    .setCustomId("confermaAnnuncio")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)
                    .addComponents(button2)

                interaction.reply({ embeds: [embed], components: [row], fetchReply: true, content: `${title}\n${msg.content}\n<@&${role}>`, allowedMentions: { parse: [] } })
                    .then(msg2 => {
                        const collector = msg2.createMessageComponentCollector();

                        collector.on('collect', async i => {
                            if (!i.isButton()) return
                            const maintenanceStates = await isMaintenance(i.user.id)
                            if (maintenanceStates) return

                            i.deferUpdate().catch(() => { })

                            if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                            if (i.customId == "annullaAnnuncio") {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle("Annuncio annullato")
                                    .setColor(colors.red)

                                msg2.edit({ embeds: [embed], components: [], content: "_Annuncio annullatto_" })
                            }
                            else if (i.customId == "confermaAnnuncio") {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle("Annuncio creato")
                                    .setColor(colors.green)
                                    .setDescription(`Annuncio di tipo \`${type}\` inviato in <#${channel}>`)

                                msg2.edit({ embeds: [embed], components: [], content: "_Annuncio creato_" })

                                client.channels.cache.get(channel).send({ content: `${title}\n${msg.content}\n<@&${role}>`, files: Array.from(msg.attachments.values()).reverse() })
                                    .then(async msg => {
                                        msg.crosspost().catch(() => { })
                                    })
                            }
                        })
                    })
            })
            .catch(() => {
                return replyMessage(client, interaction, "Error", "Messaggio non trovato", "Inserisci l'ID di un messaggio valido", comando)
            })
    },
};