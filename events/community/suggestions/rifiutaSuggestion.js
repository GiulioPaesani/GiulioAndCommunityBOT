const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("rifiutaSuggestion")) return

        await interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.split(" ")[interaction.message.embeds[0].fields[0].value.split(" ").length - 1])
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setTitle("💡Suggestion RIFIUTATO")
            .setColor(colors.red)
            .setDescription(`Il tuo suggerimento è stato purtroppo **rifiutato** dallo staff`)
            .addField(":page_facing_up: Suggestion", interaction.message.embeds[0].fields[2].value)

        utente.send({ embeds: [embed] })
            .catch(() => { })

        interaction.message.embeds[0].fields[1].value = "Refused by " + interaction.user.username
        interaction.message.embeds[0].color = colors.red

        interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
    },
};
