const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const changelogs = require("../../config/general/changelogs.json")
const { getEmoji } = require("../../functions/general/getEmoji.js")

module.exports = {
    name: "changelog",
    description: "Lista completa dei cambiamenti del bot nel corso delle versioni",
    permissionLevel: 0,
    cooldown: 5,
    requiredLevel: 0,
    syntax: "/changelog (version)",
    category: "general",
    data: {
        options: [
            {
                name: "version",
                description: "Versione del changelog da mostrare",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "[Defaut] V0622 - Giugno 2022",
                        value: "V0622"
                    },
                    {
                        name: "V0122 - Gennaio 2022",
                        value: "V0122"
                    },
                    {
                        name: "V1021 - Ottobre 2021",
                        value: "V1021"
                    },
                    {
                        name: "V0921 - Settembre 2021",
                        value: "V0921"
                    },
                    {
                        name: "V0721 - Luglio 2021",
                        value: "V0721"
                    },
                    {
                        name: "V0621 - Giugno 2021",
                        value: "V0621"
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let changelogsList = changelogs.sort((a, b) => moment(a.date) > moment(b.date) ? 1 : -1)

        let changelogIndex = changelogsList.findIndex(x => x.version == interaction.options.getString("version"))
        if (changelogIndex < 0) changelogIndex = changelogsList.length - 1
        let changelog = changelogsList[changelogIndex]

        let embed = new Discord.MessageEmbed()
            .setTitle(changelog.title)
            .setColor(colors.blue)
            .setThumbnail(`http://img.youtube.com/vi/${changelog.idVideo}/maxresdefault.jpg`)
            .setDescription(`:pencil: **Changelog ${changelog.version}** - ${["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"][moment(changelog.date).format("M") - 1]} ${moment(changelog.date).format("YYYY")}
            
${changelog.description}

:high_brightness: Le novità più **interessanti**
${changelog.bestNovita.map(x => `- ${x}`).join("\n")}

Scopri tutte i **cambiamenti**
:film_frames: Video riassuntivo: https://youtu.be/${changelog.idVideo}
:page_with_curl: Lista completa: ${changelog.documento}
`)

        let button1 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Previous"))
            .setStyle("PRIMARY")
            .setCustomId(`changelog,${interaction.user.id},`)

        if (changelogIndex == 0) {
            button1
                .setLabel("Nessun changelog più vecchio")
                .setDisabled()
        }
        else {
            button1
                .setLabel(`${changelogsList[changelogIndex - 1].version} - Più vecchio`)
                .setCustomId(`changelog,${interaction.user.id},${changelogsList[changelogIndex - 1].version}`)
        }

        let button2 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Next"))
            .setStyle("PRIMARY")
            .setCustomId(`changelog,${interaction.user.id},`)

        if (changelogIndex == changelogsList.length - 1) {
            button2
                .setLabel("Nessun changelog più recente")
                .setDisabled()
        }
        else {
            button2
                .setLabel(`${changelogsList[changelogIndex + 1].version} - Più recente`)
                .setCustomId(`changelog,${interaction.user.id},${changelogsList[changelogIndex + 1].version}`)
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};