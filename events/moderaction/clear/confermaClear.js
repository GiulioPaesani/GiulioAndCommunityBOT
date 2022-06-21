const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaClear")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let count = parseInt(interaction.customId.split(",")[2])

        let embed = new Discord.MessageEmbed()
            .setTitle("Eliminazione in corso...")
            .setColor(colors.yellow)
            .setDescription(`Messaggi eliminati: **0**`)

        interaction.message.edit({ embeds: [embed], components: [] })

        let channel = client.channels.cache.get(interaction.channelId)
        let deletedMessages = new Map()
        while (deletedMessages.size < count) {
            let daEliminare = (count - deletedMessages.size) > 100 ? 100 : (count - deletedMessages.size + 1)

            fetched = await channel.messages.fetch({ limit: daEliminare })
            fetched.delete(interaction.message.id)

            await channel.bulkDelete(fetched)

            deletedMessages = new Map([...deletedMessages, ...fetched])

            let embed = new Discord.MessageEmbed()
                .setTitle(deletedMessages.size < count ? "Eliminazione in corso..." : "Messaggi eliminati")
                .setColor(deletedMessages.size < count ? colors.yellow : colors.blue)
                .setDescription(deletedMessages.size < count ? `Messaggi eliminati: **${deletedMessages.size}**` : `Sono stati eliminati **${deletedMessages.size}** messaggi`)

            interaction.message.edit({ embeds: [embed] })
                .then(msg => {
                    if (deletedMessages.size >= count)
                        setTimeout(() => msg.delete(), 5000)
                })

            if (deletedMessages.size >= count) {
                let chatLog = ""
                for (let msg of Array.from(deletedMessages.values()).reverse()) {
                    chatLog += `${msg.author.bot ? "[BOT] " : getUserPermissionLevel(client, msg.author.id) ? "[STAFF] " : ""}@${msg.author.tag} - ${moment(msg.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? msg.embeds.map(x => `\nEmbed: ${JSON.stringify(x)}`) : ""}${msg.attachments.size > 0 ? `\nAttachments: ${msg.attachments.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}${msg.stickers.size > 0 ? `\nStickers: ${msg.stickers.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}\n\n`
                }

                let attachment1
                if (chatLog != "")
                    attachment1 = await new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `clear-${interaction.channelId}-${new Date().getTime()}.txt`);

                let embed = new Discord.MessageEmbed()
                    .setTitle(":axe: Clear :axe:")
                    .setColor(colors.purple)
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                    .addField(":anchor: Channel", `${interaction.channel.toString()} - #${interaction.channel.name}\nID: ${interaction.channelId}`)
                    .addField(":incoming_envelope: Messages deleted", deletedMessages.size.toString())

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.clear).send({ embeds: [embed], files: attachment1 ? [attachment1] : [] })
            }
        }
    },
};
