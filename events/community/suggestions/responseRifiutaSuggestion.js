const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.channel.id != log.community.suggestions) return

        message.delete()
            .catch(() => { })

        if (!message.reference) return
        if (!message.content) return

        client.channels.cache.get(log.community.suggestions).messages.fetch(message.reference.messageId)
            .then(async msg => {
                let utente = client.guilds.cache.get(settings.idServer).members.cache.get(msg.embeds[0].fields[0].value.split(" ")[msg.embeds[0].fields[0].value.split(" ").length - 1])
                if (!utente) return

                if (msg.embeds[0].fields[1].value != "Pending") return

                msg.embeds[0].fields.push({
                    name: `:outbox_tray: Response by ${message.author.username}`,
                    value: message.content.slice(0, 900),
                    inline: false
                })

                msg.embeds[0].fields[1].value = "Refused by " + message.author.username
                msg.embeds[0].color = colors.red

                msg.edit({ embeds: [msg.embeds[0]], components: [] })

                let embed = new Discord.MessageEmbed()
                    .setTitle("💡Suggestion RIFIUTATO")
                    .setColor(colors.red)
                    .setDescription(`Il tuo suggerimento è stato purtroppo **rifiutato** dallo staff`)
                    .addField(":page_facing_up: Suggestion", msg.embeds[0].fields[2].value)
                    .addField(":inbox_tray: Staff response", `Lo staff ti ha lasciato un messaggio nel rifiuto:\n${message.content.slice(0, 900)}`)

                utente.send({ embeds: [embed] })
                    .catch(() => { })
            })
    },
};