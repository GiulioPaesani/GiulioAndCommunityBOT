const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("annullaThank")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id && interaction.customId.split(",")[2] != interaction.user.id) return replyMessage(client, interaction, "NonPermesso", "", "Non hai il permesso di annullare o rifiutare questo ringraziamento")

        let embed = new Discord.MessageEmbed()
            .setTitle("Ringraziamento annullatto")
            .setColor(colors.red)
            .setDescription(`Il grazie per <@${interaction.customId.split(",")[1]}> è stato annullato`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
