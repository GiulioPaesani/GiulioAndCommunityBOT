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
    client: "general",
    data: {
        options: [
            {
                name: "type",
                description: "Tipo di annuncio da creare",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "📋 Announcement",
                        value: "announcement"
                    },
                    {
                        name: "📰 News",
                        value: "news"
                    },
                    {
                        name: "📝 Changelog",
                        value: "changelog"
                    },
                    {
                        name: "📱 Youtube GiulioAndCode",
                        value: "youtubegiulioandcode"
                    },
                    {
                        name: "✌ Youtube Giulio",
                        value: "youtubegiulio"
                    }
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
            .then(msg => {
                if (!msg || !msg.content) {
                    return replyMessage(client, interaction, "Error", "Messaggio non trovato", "Inserisci l'ID di un messaggio valido", comando)
                }

                let type = interaction.options.getString("type")
                let title = type == "announcement" ? "-----:loudspeaker: **ANNOUNCEMENT** :loudspeaker:-----" : type == "news" ? "-----:newspaper: **NEWS** :newspaper:-----" : type == "changelog" ? "----:pencil: **CHANGELOG** :pencil:-----" : type == "youtubegiulioandcode" ? "-----:computer: **NEW VIDEO** :computer:-----" : type == "youtubegiulio" ? "-----:v: **NEW VIDEO** :v:-----" : ""
                let role = type == "announcement" ? settings.ruoliNotification.announcements : type == "news" ? settings.ruoliNotification.news : type == "changelog" ? settings.ruoliNotification.changelog : type == "youtubegiulioandcode" ? settings.ruoliNotification.youtubeVideosCode : type == "youtubegiulio" ? settings.ruoliNotification.youtubeVideosGiulio : ""
                let channel = type == "youtubegiulioandcode" || type == "youtubegiulio" ? settings.idCanaliServer.youtubeNotification : settings.idCanaliServer.announcements

                let embed = new Discord.MessageEmbed()
                    .setTitle("Confermi la creazione dell'annuncio?")
                    .setColor(colors.yellow)
                    .setDescription(`${title}\n${msg.content.length > 200 ? `${msg.content.slice(197)}...` : msg.content}\n<@&${role}>`)

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

                interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
                    .then(msg => {
                        const collector = msg.createMessageComponentCollector();

                        collector.on('collect', i => {
                            if (!i.isButton()) return
                            if (isMaintenance(i.user.id)) return

                            i.deferUpdate().catch(() => { })

                            if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                            if (i.customId == "annullaAnnuncio") {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle("Annuncio annullato")
                                    .setColor(colors.red)
                                    .setDescription(msg.embeds[0].description)

                                msg.edit({ embeds: [embed], components: [] })
                            }
                            else if (i.customId == "confermaAnnuncio") {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle("Annuncio creato")
                                    .setColor(colors.green)
                                    .setDescription(msg.embeds[0].description)

                                msg.edit({ embeds: [embed], components: [] })

                                client.channels.cache.get(channel).send({ content: `${title}\n${msg.content}\n<@&${role}>`, files: Array.from(msg.attachments.values()).reverse() })
                                    .then(msg => {
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