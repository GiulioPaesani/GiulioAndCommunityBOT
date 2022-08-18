const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("rifiutiComuniProgetti")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.split(" ")[interaction.message.embeds[0].fields[0].value.split(" ").length - 1])
        if (!utente) return

        interaction.message.embeds[0].fields.push({
            name: `:outbox_tray: Response by ${interaction.user.username}`,
            value: interaction.values[0],
            inline: false
        })

        interaction.message.embeds[0].fields[1].value = "Refused by " + interaction.user.username
        interaction.message.embeds[0].color = colors.red

        interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })

        let embed = new Discord.MessageEmbed()
            .setTitle(":newspaper: Progetto RIFIUTATO")
            .setColor(colors.red)
            .setDescription(`Il tuo post è stato purtroppo **rifiutato** dallo staff`)
            .addField(interaction.message.embeds[0].fields[2].value, interaction.message.embeds[0].fields[3].value)
            .addField(":inbox_tray: Staff response", `Lo staff ti ha lasciato un messaggio nel rifiuto:\n${interaction.values[0]}`)

        utente.send({ embeds: [embed] })
            .catch(() => { })
    },
};