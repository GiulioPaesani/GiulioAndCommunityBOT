const moment = require("moment")
const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { isMaintenance } = require("./isMaintenance")
const { fetchAllMessages } = require("./fetchAllMessages")

const codeError = async (client, err) => {
    console.log(err)

    if (err.stack) err = err.stack

    if (
        err.toString().startsWith("Response: Internal Server Error") ||
        err.toString().startsWith("Error: Request failed with status code 404") ||
        err.toString().startsWith("DiscordAPIError")
    ) return

    if (!isMaintenance()) {
        let channel = client.channels.cache.get(log.general.codeErrors)
        if (!channel) return

        await fetchAllMessages(channel)
            .then(messages => {
                let messageErrore
                for (let msg of messages) {
                    if (msg.embeds[0]?.fields[1]?.value == err.slice(0, 1024)) messageErrore = msg
                }

                if (messageErrore) {
                    let times = parseInt(messageErrore.embeds[0].footer.text.split(" ")[0]) + 1

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`ERROR`)
                        .setColor(colors.red)
                        .addField(':alarm_clock: Time', moment().format('ddd DD MMM YYYY, HH:mm:ss'))
                        .addField(':name_badge: Error', err.slice(0, 1024))
                        .setFooter({ text: `${times} times` })

                    messageErrore.edit({ embeds: [embed] })
                }
                else {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`ERROR`)
                        .setColor(colors.red)
                        .addField(':alarm_clock: Time', moment().format('ddd DD MMM YYYY, HH:mm:ss'))
                        .addField(':name_badge: Error', err.slice(0, 1024))
                        .setFooter({ text: "1 time" })

                    let button1 = new Discord.MessageButton()
                        .setLabel("Elimina")
                        .setCustomId("eliminaError")
                        .setStyle("DANGER")

                    let row = new Discord.MessageActionRow()
                        .addComponents(button1)

                    // client.channels.cache.get(log.general.codeErrors).send({ embeds: [embed], components: [row] });
                }
            })
    }
}

module.exports = { codeError }