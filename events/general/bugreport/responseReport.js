const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: "messageCreate",
    client: "general",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.channel.id != log.general.bugReport) return

        message.delete()
            .catch(() => { })

        if (!message.reference) return
        if (!message.content) return

        client.channels.cache.get(log.general.bugReport).messages.fetch(message.reference.messageId)
            .then(msg => {
                if (msg.embeds[0]?.title != ":beetle: Bug report :beetle:") return

                let utente = client.guilds.cache.get(settings.idServer).members.cache.get(msg.embeds[0].fields[1].value.slice(msg.embeds[0].fields[1].value.length - 18))
                if (!utente) return msg.delete()

                let embed = new Discord.MessageEmbed()
                    .setTitle(":beetle: Bug REPORTATO")
                    .setColor(colors.green)
                    .setDescription(`Il tuo bug è stato visionato, e lo staff ti ha lasciato un messaggio`)
                    .addField(":page_facing_up: Report", msg.embeds[0].fields[2].value)
                    .addField(":inbox_tray: Staff response", message.content.slice(0, 1000))

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                embed = new Discord.MessageEmbed()
                    .setTitle(":outbox_tray: Bug Response :outbox_tray:")
                    .setColor(colors.red)
                    .setDescription(msg.embeds[0].description)
                    .addField(":alarm_clock: Time", msg.embeds[0].fields[0].value, true)
                    .addField(":bust_in_silhouette: User", msg.embeds[0].fields[1].value)
                    .addField(":page_facing_up: Text", msg.embeds[0].fields[2].value)
                    .addField(`:label: Response by ${message.author.username}`, message.content.slice(0, 1000))

                msg.edit({ embeds: [embed] })
            })
    },
};