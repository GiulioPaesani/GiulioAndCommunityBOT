const Discord = require("discord.js")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")

module.exports = {
    name: "sub",
    description: "Mandare contenuti in eslusiva agli abbonati YouTube e Twitch",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/sub [video, world, code]",
    category: "general",
    data: {
        options: [
            {
                name: "video",
                description: "Pubblicare un video in anteprima",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "title",
                        description: "Titolo del video",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "title_censored",
                        description: "Titolo del video censurato",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "image",
                        description: "Copertina del video",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "image_censored",
                        description: "Copertina del video censurata",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "publish_data",
                        description: "Data realte di pubblicazione del video",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "video_link",
                        description: "Link del video",
                        type: "STRING",
                        required: true,
                    }

                ]
            },
            {
                name: "world",
                description: "Pubblicare il mondo della GiulioAndCraft",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "link",
                        description: "Link del file del mondo",
                        type: "STRING",
                        required: true,
                    }
                ]
            },
            {
                name: "code",
                description: "Pubblicare il source code di GiulioAndCoding",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "link",
                        description: "Link del file del progetto",
                        type: "STRING",
                        required: true,
                    }
                ]
            }

        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        if (interaction.options.getSubcommand() == "video") {
            const title = interaction.options.getString("title")
            const title_censored = interaction.options.getString("title_censored")
            const image = interaction.options.getString("image")
            const image_censored = interaction.options.getString("image_censored")
            const publish_data = interaction.options.getString("publish_data")
            const video_link = interaction.options.getString("video_link")

            let embed = new Discord.MessageEmbed()
                .setTitle(":face_with_monocle: Video in anteprima")
                .setColor("#16A0F4")
                .addFields([
                    {
                        name: ":thought_balloon: Title",
                        value: title
                    },
                    {
                        name: ":link: Video link",
                        value: video_link
                    },
                    {
                        name: ":frame_photo: Thumbnail",
                        value: image
                    }
                ])

            const msg = await client.channels.cache.get(log.general.subscontent).send({ embeds: [embed] })

            let embed2 = new Discord.MessageEmbed()
                .setTitle(":face_with_monocle: Video in anteprima")
                .setColor("#16A0F4")
                .setDescription(`È appena uscito un nuovo video in **anteprima** solo per gli abbonati <@&${settings.idRuoloGiulioSubPro}>
            
**${title_censored}**
_Uscirà per tutti il ${publish_data}_

:gem: Guardalo ora **ABBONANDOTI** al canale a soly 2,99€! Fallo subito [QUI](https://www.youtube.com/giulioandcode/join)
`)
                .setImage(image_censored)

            let button1 = new Discord.MessageButton()
                .setLabel("Abbonati ora")
                .setStyle("LINK")
                .setURL("https://www.youtube.com/giulioandcode/join")

            let button2 = new Discord.MessageButton()
                .setLabel("Guarda il video")
                .setStyle("PRIMARY")
                .setCustomId(`sub,video,${msg.id}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed2], components: [row] })

            let embed3 = new Discord.MessageEmbed()
                .setTitle(":face_with_monocle: Video in anteprima")
                .setColor("#16A0F4")
                .setDescription(`È appena uscito un nuovo video in **anteprima** solo per voi abbonati <@&${settings.idRuoloGiulioSubPro}>
                
**${title_censored}**
                `)
                .setImage(image_censored)

            let button3 = new Discord.MessageButton()
                .setLabel("Guarda il video")
                .setStyle("PRIMARY")
                .setCustomId(`sub,video,${msg.id}`)

            let row2 = new Discord.MessageActionRow()
                .addComponents(button3)


            client.channels.cache.get(settings.idCanaliServer.subs).send({ embeds: [embed3], components: [row2] })

            let embed4 = new Discord.MessageEmbed()
                .setTitle(":face_with_monocle: Video in anteprima")
                .setColor("#16A0F4")
                .setDescription("Contenuto inviato")

            interaction.reply({ embeds: [embed4], ephemeral: true })
        }
        else if (interaction.options.getSubcommand() == "world") {
            const link = interaction.options.getString("link")

            let embed = new Discord.MessageEmbed()
                .setTitle(":video_game: GiulioAndCraft World")
                .setColor("#50A75B")
                .addFields([
                    {
                        name: ":link: Link",
                        value: link
                    }
                ])

            const msg = await client.channels.cache.get(log.general.subscontent).send({ embeds: [embed] })

            let embed2 = new Discord.MessageEmbed()
                .setTitle(":video_game: GiulioAndCraft World")
                .setColor("#50A75B")
                .setDescription(`Disponibile il download aggiornato del mondo della **GiulioAndCraft** solo per gli abbonati <@&${settings.idRuoloGiulioSubTwitch}>
        
:gem: **ABBONATI** ora al canale Twitch di Giulio, hai una **sub gratuita** al mese con Prime! Fallo subito [QUI](https://twitch.tv/giulioandcode)
`)

            let button1 = new Discord.MessageButton()
                .setLabel("Abbonati ora")
                .setStyle("LINK")
                .setURL("https://twitch.tv/giulioandcode")

            let button2 = new Discord.MessageButton()
                .setLabel("Scarica il mondo")
                .setStyle("PRIMARY")
                .setCustomId(`sub,world,${msg.id}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed2], components: [row] })

            let embed3 = new Discord.MessageEmbed()
                .setTitle(":video_game: GiulioAndCraft World")
                .setColor("#50A75B")
                .setDescription(`Disponibile il download aggiornato del mondo della **GiulioAndCraft** solo per voi abbonati <@&${settings.idRuoloGiulioSubTwitch}>`)

            let button3 = new Discord.MessageButton()
                .setLabel("Scarica il mondo")
                .setStyle("PRIMARY")
                .setCustomId(`sub,world,${msg.id}`)

            let row2 = new Discord.MessageActionRow()
                .addComponents(button3)


            client.channels.cache.get(settings.idCanaliServer.subs).send({ embeds: [embed3], components: [row2] })

            let embed4 = new Discord.MessageEmbed()
                .setTitle(":video_game: GiulioAndCraft World")
                .setColor("#50A75B")
                .setDescription("Contenuto inviato")

            interaction.reply({ embeds: [embed4], ephemeral: true })
        }
        else if (interaction.options.getSubcommand() == "code") {
            const link = interaction.options.getString("link")

            let embed = new Discord.MessageEmbed()
                .setTitle(":desktop: GiulioAndCoding Source code")
                .setColor("#506EA7")
                .addFields([
                    {
                        name: ":link: Link",
                        value: link
                    }
                ])

            const msg = await client.channels.cache.get(log.general.subscontent).send({ embeds: [embed] })

            let embed2 = new Discord.MessageEmbed()
                .setTitle(":desktop: GiulioAndCoding Source code")
                .setColor("#506EA7")
                .setDescription(`Disponibile il download del source code di ciò che sviluppiano in **GiulioAndCoding** solo per gli abbonati <@&${settings.idRuoloGiulioSubTwitch}>
        
:gem: **ABBONATI** ora al canale Twitch di Giulio, hai una **sub gratuita** al mese con Prime! Fallo subito [QUI](https://twitch.tv/giulioandcode)
`)

            let button1 = new Discord.MessageButton()
                .setLabel("Abbonati ora")
                .setStyle("LINK")
                .setURL("https://twitch.tv/giulioandcode")

            let button2 = new Discord.MessageButton()
                .setLabel("Scarica il codice")
                .setStyle("PRIMARY")
                .setCustomId(`sub,code,${msg.id}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed2], components: [row] })

            let embed3 = new Discord.MessageEmbed()
                .setTitle(":desktop: GiulioAndCoding Source code")
                .setColor("#506EA7")
                .setDescription(`Disponibile il download del source code di ciò che sviluppiano in **GiulioAndCoding** solo per voi abbonati <@&${settings.idRuoloGiulioSubTwitch}>`)

            let button3 = new Discord.MessageButton()
                .setLabel("Scarica il codice")
                .setStyle("PRIMARY")
                .setCustomId(`sub,code,${msg.id}`)

            let row2 = new Discord.MessageActionRow()
                .addComponents(button3)

            client.channels.cache.get(settings.idCanaliServer.subs).send({ embeds: [embed3], components: [row2] })

            let embed4 = new Discord.MessageEmbed()
                .setTitle(":desktop: GiulioAndCoding Source code")
                .setColor("#506EA7")
                .setDescription("Contenuto inviato")

            interaction.reply({ embeds: [embed4], ephemeral: true })
        }


        return true
    },
};