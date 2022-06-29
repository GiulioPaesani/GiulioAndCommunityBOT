const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json");
const log = require("../../config/general/log.json");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: "clear",
    description: "Eliminare messaggi in massa",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/clear [count]",
    category: "moderation",
    data: {
        options: [
            {
                name: "count",
                description: "Numero di messaggi da eliminare",
                type: "INTEGER",
                required: true,
                minValue: 1
            }
        ]
    },
    otherGuild: true,
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let count = interaction.options.getInteger("count")

        if (count <= 100) {
            await client.channels.cache.get(interaction.channelId).bulkDelete(count)
                .then(async messages => {
                    let chatLog = ""
                    for (let msg of Array.from(messages.values()).reverse()) {
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
                        .addField(":anchor: Channel", `${client.channels.cache.get(interaction.channelId).toString()} - #${client.channels.cache.get(interaction.channelId).name}\nID: ${interaction.channelId}`)
                        .addField(":incoming_envelope: Messages deleted", messages.size.toString())

                    const maintenanceStatus = await isMaintenance()
                    if (!maintenanceStatus)
                        client.channels.cache.get(log.moderation.clear).send({ embeds: [embed], files: attachment1 ? [attachment1] : [] })
                })
                .catch(() => { })

            let embed = new Discord.MessageEmbed()
                .setTitle("Messaggi eliminati")
                .setColor(colors.blue)
                .setDescription(`Sono stati eliminati **${count}** messaggi`)

            let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

            setTimeout(() => msg.delete(), 5000)

        }
        else {
            let embed = new Discord.MessageEmbed()
                .setTitle("Confermi l'eliminazione?")
                .setColor(colors.yellow)
                .setDescription(`Stai cercando di eliminare **${count}** messaggi, vuoi confermare?`)

            let button1 = new Discord.MessageButton()
                .setLabel("Annulla")
                .setStyle("DANGER")
                .setCustomId(`annullaClear,${interaction.user.id},${count}`)

            let button2 = new Discord.MessageButton()
                .setLabel("Conferma")
                .setStyle("SUCCESS")
                .setCustomId(`confermaClear,${interaction.user.id},${count}`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row] })
        }
    },
};