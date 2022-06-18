const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("annullaCompleanno")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle("Complenno annullato")
            .setColor(colors.red)
            .setThumbnail("attachment://canvas.png")
            .setDescription("Inserimento del compleanno annullato")

        interaction.message.edit({ embeds: [embed], components: [] })

        setTimeout(() => {
            interaction.message.delete()
        }, 1000 * 20)
    },
};
