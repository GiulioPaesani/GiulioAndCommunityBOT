const Discord = require("discord.js")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json");
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { updateServer } = require("../../functions/database/updateServer");
const { fetchAllMessages } = require("../../functions/general/fetchAllMessages");
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: "pdelete",
    description: "Eliminare una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/pdelete [room]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza che vuoi eliminare",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = getServer()

        if (getUserPermissionLevel(client, interaction.user.id) <= 1 && interaction.channelId != settings.idCanaliServer.commands && !serverstats.privateRooms.find(x => x.channel == interaction.channelId)) {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }

        let room
        if (!serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)) {
            return replyMessage(client, interaction, "Error", "Stanza non trovata", "Il canale che hai scelto non è una stanza privata", comando)
        }
        else {
            room = serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)
            if (!room.owners.includes(interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) == 0) {
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi eliminare questa stanza privata", comando)
            }
        }

        if (room.daEliminare) {
            return replyMessage(client, interaction, "Warning", "Già in chiusura", "Questa stanza si sta già eliminando", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Stanza in eliminazione...")
            .setColor(colors.red)
            .setDescription("Questa stanza si eliminerà tra `20 secondi`")

        let button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setStyle("DANGER")
            .setCustomId(`annullaChiusuraRoom,${room.channel}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
            .then(msg => {
                serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)].daEliminare = true;
                updateServer(serverstats)

                setTimeout(function () {
                    room = serverstats.privateRooms.find(x => x.channel == room.channel)
                    if (room?.daEliminare) {
                        embed.setDescription("Questa stanza si eliminerà tra `10 secondi`")
                        msg.edit({ embeds: [embed] })

                        setTimeout(async function () {
                            room = serverstats.privateRooms.find(x => x.channel == room.channel)
                            if (room?.daEliminare) {
                                let channel = client.channels.cache.get(room.channel)
                                if (!channel) return

                                let ownersList = ""
                                let i = 0

                                while (room.owners[i] && ownersList.length + `- ${client.users.cache.get(room.owners[i])?.toString()} - ID: ${room.owners[i]}\n`.length < 900) {
                                    ownersList += `- ${client.users.cache.get(room.owners[i])?.toString()} - ID: ${room.owners[i]}\n`
                                    i++
                                }

                                if (room.owners.length > i)
                                    ownersList += `Altri ${room.owners.length - i}...`

                                let embed2 = new Discord.MessageEmbed()
                                    .setTitle(":paperclips: Room closed :paperclips:")
                                    .setColor(colors.red)
                                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                    .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                                    .addField(":bust_in_silhouette: Owner", ownersList)
                                    .addField("Category", room.type == "text" ? "Text" : "Voice")

                                let chatLog = ""
                                if (channel.type == "GUILD_TEXT")
                                    await fetchAllMessages(channel)
                                        .then(async messages => {
                                            for (let msg of messages) {
                                                chatLog += `${msg.author.bot ? "[BOT] " : room.owners.includes(msg.author.id) ? "[OWNER] " : getUserPermissionLevel(client, msg.author.id) ? "[STAFF] " : ""}@${msg.author.tag} - ${moment(msg.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? msg.embeds.map(x => `\nEmbed: ${JSON.stringify(x)}`) : ""}${msg.attachments.size > 0 ? `\nAttachments: ${msg.attachments.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}${msg.stickers.size > 0 ? `\nStickers: ${msg.stickers.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}\n\n`
                                            }
                                        })

                                let attachment1
                                if (chatLog != "")
                                    attachment1 = await new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `room-${room.channel}-${new Date().getTime()}.txt`);

                                // if (!isMaintenance())
                                //     client.channels.cache.get(log.community.privateRooms).send({ embeds: [embed2], files: attachment1 ? [attachment1] : [] })

                                embed
                                    .setTitle("Stanza eliminata")
                                    .setDescription(`La stanza #${client.channels.cache.get(room.channel).name} è stata eliminata`)

                                msg.edit({ embeds: [embed], components: [] })

                                channel.delete()
                                    .catch(() => { });

                                serverstats.privateRooms = serverstats.privateRooms.filter((x) => x.channel != room.channel);
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