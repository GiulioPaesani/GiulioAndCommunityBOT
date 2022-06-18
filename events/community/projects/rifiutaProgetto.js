const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("rifiutaProgetto")) return

        interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":newspaper: Progetto RIFIUTATO")
            .setColor(colors.red)
            .setDescription(`Il tuo post è stato purtroppo **rifiutato** dallo staff`)
            .addField(interaction.message.embeds[0].fields[2].value, interaction.message.embeds[0].fields[3].value)

        utente.send({ embeds: [embed] })
            .catch(() => { })

        interaction.message.embeds[0].fields[1].value = "Refused by " + interaction.user.username
        interaction.message.embeds[0].color = colors.red

        interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
    },
};
