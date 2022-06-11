const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: "messageCreate",
    client: "general",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.channel.id != log.community.qna) return

        message.delete()
            .catch(() => { })

        if (getUserPermissionLevel(client, interaction.user.id) < 3) return

        if (!message.reference) return
        if (!message.content) return

        client.channels.cache.get(log.community.qna).messages.fetch(message.reference.messageId)
            .then(msg => {
                let utente = client.guilds.cache.get(settings.idServer).members.cache.get(msg.embeds[0].fields[0].value.slice(msg.embeds[0].fields[0].value.length - 18))
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
                    .setTitle(":love_letter: Domanda RIFIUTATA")
                    .setColor(colors.red)
                    .setDescription(`La tua domanda è stata purtroppo **rifiutata** dallo staff`)
                    .addField(":page_facing_up: Text", msg.embeds[0].fields[2].value)
                    .addField(":inbox_tray: Staff response", `Lo staff ti ha lasciato un messaggio nel rifiuto:\n${message.content.slice(0, 900)}`)

                utente.send({ embeds: [embed] })
                    .catch(() => { })
            })
    },
};