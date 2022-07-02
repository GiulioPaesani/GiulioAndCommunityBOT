const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
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

        let idVideo = interaction.customId.split(",")[1]
        let title = interaction.customId.split(",")[2]
        let publishdate = interaction.customId.split(",")[3]

        let embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(colors.blue)
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
