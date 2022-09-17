const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("annullaTerminaEvento")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[2])
        if (!event) return

        let embed = new Discord.MessageEmbed()
            .setTitle("Fine dell'evento annullata")
            .setColor(colors.red)
            .setDescription("L'evento non è stato terminato")

        interaction.message.edit({ embeds: [embed], components: [] })

    },
};