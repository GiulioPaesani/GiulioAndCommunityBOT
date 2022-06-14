const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    client: "moderation",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("annullaClear")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle("Eliminazione annullata")
            .setColor(colors.red)
            .setDescription(`Annulla l'eliminazione di **${interaction.customId.split(",")[2]}** messaggi`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
