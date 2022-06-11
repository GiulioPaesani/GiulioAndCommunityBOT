const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("rifiutaDomanda")) return

        if (getUserPermissionLevel(client, interaction.user.id) < 3) return replyMessage(client, interaction, "NonPermesso", "", "Non hai il permesso di rifiutare una domanda")

        interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":love_letter: Domanda RIFIUTATA")
            .setColor(colors.red)
            .setDescription(`La tua domanda è stata purtroppo **rifiutata** dallo staff`)
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[2].value)

        utente.send({ embeds: [embed] })
            .catch(() => { })

        interaction.message.embeds[0].fields[1].value = "Refused by " + interaction.user.username
        interaction.message.embeds[0].color = colors.red

        interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
    },
};
