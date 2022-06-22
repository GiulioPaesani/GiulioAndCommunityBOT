const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("rifiutiComuniDomande")) return

        if (isMaintenance(interaction.user.id)) return

        if (getUserPermissionLevel(client, interaction.user.id) < 3) return replyMessage(client, interaction, "NonPermesso", "", "Non hai il permesso di rifiutare una domanda")

        interaction.deferUpdate()

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
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
            .setTitle(":love_letter: Domanda RIFIUTATA")
            .setColor(colors.red)
            .setDescription(`La tua domanda è stata purtroppo **rifiutata** dallo staff`)
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[2].value)
            .addField(":inbox_tray: Staff response", `Lo staff ti ha lasciato un messaggio nel rifiuto:\n${interaction.values[0]}`)

        utente.send({ embeds: [embed] })
            .catch(() => { })
    },
};