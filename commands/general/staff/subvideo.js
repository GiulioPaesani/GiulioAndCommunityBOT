const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: "subvideo",
    description: "Mandare l'annuncio dell'uscita di un video in anteprima per gli abbonati",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/subvideo [linkvideo] [title] [thumbnail] [publishdate]",
    category: "general",
    data: {
        options: [
            {
                name: "idvideo",
                description: "ID del video",
                type: "STRING",
                required: true,
            },
            {
                name: "title",
                description: "Titolo del video censurato",
                type: "STRING",
                required: true,
            },
            {
                name: "thumbnail",
                description: "Url dell'immagine di copertita censurata",
                type: "STRING",
                required: true,
            },
            {
                name: "publishdate",
                description: "Data di uscita del video",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let idvideo = interaction.options.getString("idvideo")
        let title = interaction.options.getString("title")
        let thumbnail = interaction.options.getString("thumbnail")
        let publishdate = interaction.options.getString("publishdate")

        let embed = new Discord.MessageEmbed()
            .setTitle("Confermi il video in anteprima?")
            .setColor(colors.yellow)
            .setDescription(`**${title}**
${moment(publishdate, "DD/MM/YYYY").format("dddd DD MMMM yyyy")} - [Video link](https://youtu.be/${idvideo})`)
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
                    }
                    else if (i.customId == "confermaSubVideo") {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Video annunciato")
                            .setColor(colors.green)
                            .setDescription(msg2.embeds[0].description)

                        msg2.edit({ embeds: [embed], components: [] })

                        let embed2 = new Discord.MessageEmbed()
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
                            .setCustomId(`scopriSubVideo,${idvideo},${publishdate}`)

                        let row = new Discord.MessageActionRow()
                            .addComponents(button1)
                            .addComponents(button2)

                        //! CAMBIARE CANALE
                        client.channels.cache.get(settings.idCanaliServer.testing).send({ embeds: [embed2], components: [row] })
                    }
                })
            })
    },
};