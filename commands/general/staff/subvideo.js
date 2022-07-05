const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: "subvideo",
    description: "Mandare l'annuncio dell'uscita di un video in anteprima per gli abbonati",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/subvideo [id_censored_video] [censored_title] [title] [censored_thumbnail] [thumbnail] [publish_date]",
    category: "general",
    data: {
        options: [
            {
                name: "id_censored_video",
                description: "ID del video per abbonati",
                type: "STRING",
                required: true,
            },
            {
                name: "censored_title",
                description: "Titolo del video censurato",
                type: "STRING",
                required: true,
            },
            {
                name: "title",
                description: "Titolo del video completo",
                type: "STRING",
                required: true,
            },
            {
                name: "censored_thumbnail",
                description: "Url dell'immagine di copertita censurata",
                type: "STRING",
                required: true,
            },
            {
                name: "thumbnail",
                description: "Url dell'immagine di copertita completa",
                type: "STRING",
                required: true,
            },
            {
                name: "publish_date",
                description: "Data di uscita del video",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let idvideo = interaction.options.getString("id_censored_video")
        let title = interaction.options.getString("censored_title")
        let title2 = interaction.options.getString("title")
        let thumbnail = interaction.options.getString("censored_thumbnail")
        let thumbnail2 = interaction.options.getString("thumbnail")
        let publishdate = interaction.options.getString("publish_date")

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il video in anteprima?")
            .setColor(colors.yellow)
            .setDescription(`**${title}**`)
            .setImage(thumbnail)

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId("annullaSubVideo")

        let button2 = new Discord.MessageButton()
            .setLabel("Conferma video")
            .setStyle("SUCCESS")
            .setCustomId("confermaSubVideo")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
            .then(msg2 => {
                const collector = msg2.createMessageComponentCollector();

                collector.on('collect', async i => {
                    if (!i.isButton()) return
                    const maintenanceStates = await isMaintenance(i.user.id)
                    if (maintenanceStates) return

                    i.deferUpdate().catch(() => { })

                    if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                    if (i.customId == "annullaSubVideo") {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Video annullato")
                            .setColor(colors.red)
                            .setDescription(msg2.embeds[0].description)

                        msg2.edit({ embeds: [embed], components: [] })
                            .then(() => setTimeout(() => msg2.delete(), 2000))
                    }
                    else if (i.customId == "confermaSubVideo") {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Video annunciato")
                            .setColor(colors.green)
                            .setDescription(msg2.embeds[0].description)

                        msg2.edit({ embeds: [embed], components: [] })
                            .then(() => setTimeout(() => msg2.delete(), 2000))

                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(":gem: Sub video notification :gem:")
                            .setColor(colors.blue)
                            .addField(":thought_balloon: Title", title2)
                            .addField(":placard: Video ID", idvideo)
                            .addField(":frame_photo: Thumbnail", `[Thumbnail](${thumbnail2})`)
                            .addField(":alarm_clock: Publish date", publishdate)

                        let msg = await client.channels.cache.get(log.general.subvideo).send({ embeds: [embed2] })

                        let embed3 = new Discord.MessageEmbed()
                            .setTitle(":film_frames: Nuovo video in anteprima :face_with_monocle:")
                            .setColor(colors.blue)
                            .setDescription(`È appena uscito un nuovo video in **anteprima** solo per gli abbonati <@&${settings.idRuoloGiulioSubPro}>
                            
**${title}**
_Uscirà per tutti il ${moment(publishdate, "DD/MM/YYYY").format("DD/MM/yyyy")}_

:gem: Guardalo ora **ABBONANDOTI** al canale! Fallo subito [QUI](https://www.youtube.com/giulioandcode/join)
`)
                            .setImage(thumbnail)

                        let button1 = new Discord.MessageButton()
                            .setLabel("Abbonati ora")
                            .setStyle("LINK")
                            .setURL("https://www.youtube.com/giulioandcode/join")

                        let button2 = new Discord.MessageButton()
                            .setLabel("Scopri il video")
                            .setStyle("PRIMARY")
                            .setCustomId(`scopriSubVideo,${msg.id}`)

                        let row = new Discord.MessageActionRow()
                            .addComponents(button1)
                            .addComponents(button2)

                        client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed3], components: [row] })
                    }
                })
            })

        return true
    },
};