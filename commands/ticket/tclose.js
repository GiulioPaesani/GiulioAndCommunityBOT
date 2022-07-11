const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateServer } = require("../../functions/database/updateServer");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { fetchAllMessages } = require("../../functions/general/fetchAllMessages");

module.exports = {
    name: "tclose",
    description: "Chiudere un ticket",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/tclose",
    category: "rooms",
    data: {
        options: [
            {
                name: "reason",
                description: "Motivo della chiusura del ticket",
                type: "STRING",
                required: false,
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = await getServer()
        let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)

        if (!ticket) {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }

        if (!interaction.user.id != ticket.owner && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi chiudere questo ticket", comando)
        }

        if (ticket.daEliminare) {
            return replyMessage(client, interaction, "Warning", "Già in chiusura", "Il ticket si sta già eliminando", comando)
        }

        let reason = interaction.options.getString("reason")
        if (reason && reason.length > 1024) {
            return replyMessage(client, interaction, "Warning", "Motivo troppo lungo", "Puoi inserire una motivazione solo fino a 1024 caratteri", comando)
        }

        client.channels.cache.get(ticket.channel).messages.fetch(ticket.message)
            .then(async msg => {
                let button1 = new Discord.MessageButton()
                    .setLabel("In chiusura...")
                    .setStyle("DANGER")
                    .setCustomId("ticketChiudi")
                    .setDisabled()

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                msg.edit({ embeds: [msg.embeds[0]], components: [row] })
            })

        let embed = new Discord.MessageEmbed()
            .setTitle("Ticket in chiusura...")
            .setColor(colors.red)
            .setDescription("Questo ticket si chiuderà tra `20 secondi`")

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId("annullaChiusuraTicket")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
            .then(async msg => {
                serverstats.tickets[serverstats.tickets.findIndex(x => x.channel == interaction.channelId)].daEliminare = true;
                updateServer(serverstats)

                setTimeout(function () {
                    serverstats = await getServer()
                    let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)
                    if (ticket?.daEliminare) {
                        embed.setDescription("Questo ticket si chiuderà tra `10 secondi`")
                        msg.edit({ embeds: [embed] })
                            .catch(() => { })

                        setTimeout(async function () {
                            serverstats = await getServer()
                            let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)
                            if (ticket?.daEliminare) {
                                let channel = client.channels.cache.get(ticket.channel)
                                if (!channel) return

                                let embed2 = new Discord.MessageEmbed()
                                    .setTitle(":paperclips: Ticket closed :paperclips:")
                                    .setColor(colors.red)
                                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                    .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                                    .addField(":bust_in_silhouette: Owner", `${client.users.cache.get(ticket.owner).toString()} - ID: ${ticket.owner}`)
                                    .addField("Category", ticket.type)
                                    .addField("Reason", reason || "_Nessun motivo_")

                                let chatLog = ""
                                await fetchAllMessages(channel)
                                    .then(async messages => {
                                        for (let msg of messages) {
                                            chatLog += `${msg.author.bot ? "[BOT] " : msg.author.id == ticket.owner ? "[OWNER] " : getUserPermissionLevel(client, msg.author.id) ? "[STAFF] " : ""}@${msg.author.tag} - ${moment(msg.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? msg.embeds.map(x => `\nEmbed: ${JSON.stringify(x)}`) : ""}${msg.attachments.size > 0 ? `\nAttachments: ${msg.attachments.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}${msg.stickers.size > 0 ? `\nStickers: ${msg.stickers.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}\n\n`
                                        }
                                    })

                                let attachment1
                                if (chatLog != "")
                                    attachment1 = await new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `ticket-${ticket.channel}-${new Date().getTime()}.txt`);

                                const maintenanceStatus = await isMaintenance()
                                if (!maintenanceStatus)
                                    client.channels.cache.get(log.community.ticket).send({ embeds: [embed2], files: attachment1 ? [attachment1] : [] })

                                embed.setDescription("Questo ticket si sta per chiudere")
                                msg.edit({ embeds: [embed], components: [] })
                                    .catch(() => { })

                                channel.delete()
                                    .catch(() => { });
                                serverstats.tickets = serverstats.tickets.filter((x) => x.channel != interaction.channelId);

                                updateServer(serverstats)
                            }
                            else return
                        }, 10000);
                    }
                    else return
                }, 10000);
            })
    },
};