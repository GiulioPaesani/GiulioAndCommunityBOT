const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("annullaSegnala")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle("Segnalazione annullata")
            .setColor(colors.red)
            .setDescription(`Report annullato`)
            .addField(":bust_in_silhouette: User", interaction.message.embeds[0].fields[0].value)
            .addField(":page_facing_up: Reason", interaction.message.embeds[0].fields[1].value)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
