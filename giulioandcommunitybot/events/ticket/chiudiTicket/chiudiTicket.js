const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { updateServer } = require("../../../functions/database/updateServer");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { fetchAllMessages } = require("../../../functions/general/fetchAllMessages");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "chiudiTicket") return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        let serverstats = getServer()
        let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)
        if (!ticket) return

        if (interaction.user.id != ticket.owner && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi chiudere questo ticket")
        }

        let button1 = new Discord.MessageButton()
            .setLabel("In chiusura...")
            .setStyle("DANGER")
            .setCustomId("chiudiTicket")
            .setDisabled()

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.message.edit({
            embeds: [interaction.message.embeds[0]],
            components: [row]
        })

        let embed = new Discord.MessageEmbed()
            .setTitle("Ticket in chiusura...")
            .setColor(colors.red)
            .setDescription("Questo ticket si chiuderà tra `20 secondi`")

        button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId("annullaChiusuraTicket")

        row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.message.channel.send({ embeds: [embed], components: [row] })
            .then(msg => {
                serverstats.tickets[serverstats.tickets.findIndex(x => x.channel == interaction.channelId)].daEliminare = true;
                updateServer(serverstats)

                setTimeout(function () {
                    let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)
                    if (ticket?.daEliminare) {
                        embed.setDescription("Questo ticket si chiuderà tra `10 secondi`")
                        msg.edit({ embeds: [embed] })

                        setTimeout(function () {
                            let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)
                            if (ticket?.daEliminare) {
                                client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
                                    .then(async msg => {
                                        let embed = new Discord.MessageEmbed()
                                            .setTitle(":paperclips: Ticket closed :paperclips:")
                                            .setColor(colors.red)
                                            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                            .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                                            .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)
                                            .addField("Category", ticket.type)

                                        let chatLog = ""
                                        await fetchAllMessages(interaction.message.channel)
                                            .then(async messages => {
                                                for (let msg of messages) {
                                                    chatLog += `${msg.author.bot ? "[BOT] " : msg.author.id == ticket.owner ? "[OWNER] " : getUserPermissionLevel(client, msg.author.id) ? "[STAFF] " : ""}@${msg.author.tag} - ${moment(msg.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? msg.embeds.map(x => `\nEmbed: ${JSON.stringify(x)}`) : ""}${msg.attachments.size > 0 ? `\nAttachments: ${msg.attachments.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}${msg.stickers.size > 0 ? `\nStickers: ${msg.stickers.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}\n\n`
                                                }
                                            })

                                        let attachment1
                                        if (chatLog != "")
                                            attachment1 = await new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `ticket-${ticket.channel}-${new Date().getTime()}.txt`);

                                        if (!isMaintenance())
                                            client.channels.cache.get(log.community.ticket).send({ embeds: [embed], files: [attachment1] || [] })

                                        embed.setDescription("Questo ticket si sta per chiudere")
                                        msg.edit({ embeds: [embed] })


                                        interaction.message.channel.delete()
                                            .catch(() => { });
                                        serverstats.tickets = serverstats.tickets.filter((x) => x.channel != interaction.message.channel.id);

                                        updateServer(serverstats)
                                    })
                            }
                            else return
                        }, 10000);
                    }
                    else return
                }, 10000);
            })
    },
};