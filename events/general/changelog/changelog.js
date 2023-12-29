const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const changelogs = require("../../../config/general/changelogs.json")
const { getEmoji } = require("../../../functions/general/getEmoji.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("changelog")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let changelogsList = changelogs.sort((a, b) => moment(a.date) > moment(b.date) ? 1 : -1)

        let changelogIndex = changelogsList.findIndex(x => x.version == interaction.customId.split(",")[2])
        let changelog = changelogsList[changelogIndex]

        let embed = new Discord.MessageEmbed()
            .setTitle(changelog.title)
            .setColor(colors.blue)
            .setDescription(`:pencil: **Changelog ${changelog.version}** - ${["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"][moment(changelog.date).format("M") - 1]} ${moment(changelog.date).format("YYYY")}
            
${changelog.description}

:high_brightness: Le novità più **interessanti**
${changelog.bestNovita.map(x => `- ${x}`).join("\n")}

Scopri tutte i **cambiamenti**
:film_frames: Video riassuntivo: ${changelog.idVideo ? `https://youtu.be/${changelog.idVideo}` : '_Video non presente_'} 
:page_with_curl: Lista completa: ${changelog.documento}
`)

        if (changelog.idVideo) {
            embed
                .setThumbnail(`http://img.youtube.com/vi/${changelog.idVideo}/maxresdefault.jpg`)
        }

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

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};
