const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("scopriSubVideo")) return

        await interaction.deferUpdate().catch(() => { })

        if (!interaction.member.roles.cache.has(settings.idRuoloGiulioSubPro)) return replyMessage(client, interaction, "NonPermesso", null, "Per vedere questo video è necessario **abbonarsi** al livello GiulioSub Pro e **collegare** il tuo account Youtube a Discord")

        let msg = await client.channels.cache.get(log.general.subvideo).messages.fetch(interaction.customId.split(",")[1])
        if (!msg) return

        let idVideo = msg.embeds[0].fields[1].value
        let title = msg.embeds[0].fields[0].value
        let thumbnail = msg.embeds[0].fields[2].value.slice("[Thumbnail](".length, -1)
        let publishdate = msg.embeds[0].fields[3].value

        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(colors.blue)
            .setThumbnail(thumbnail)
            .setDescription(`:gem: Video in anteprima, uscirà pubblicamente il ${moment(publishdate, "DD/MM/YYYY").format("DD/MM/yyyy")}`)

        let button1 = new Discord.MessageButton()
            .setURL(`https://www.youtube.com/watch?v=${idVideo}`)
            .setStyle("LINK")
            .setLabel("Vai al video")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })
    },
};
