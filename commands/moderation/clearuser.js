const Discord = require("discord.js");
const ms = require("ms");
const moment = require("moment");
const log = require("../../config/general/log.json");
const colors = require("../../config/general/colors.json");
const { getEmoji } = require("../../functions/general/getEmoji");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { replyMessage } = require("../../functions/general/replyMessage");
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: "clearuser",
    description: "Eliminare messaggi di un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/clearuser [user] [time]",
    category: "moderation",
    client: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente del quale vuoi eliminare i messaggi",
                type: "STRING",
                required: true,
                autocomplete: true
            },
            {
                name: "time",
                description: "Tempo nel quale eliminare i messaggi",
                type: "STRING",
                required: true,
            },
            {
                name: "mode",
                description: "Modalità di eliminazione dei messaggi",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "Only this channel",
                        value: "thischannel"
                    },
                    {
                        name: "All channels",
                        value: "allchannels"
                    }
                ]
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi cancellare i messaggi specifici di questo utente", comando)
        }

        let time = interaction.options.getString("time")
        time = ms(time)

        if (!time || time < 0) {
            return replyMessage(client, interaction, "Error", "Tempo non valido", "Scrivi un tempo valido", comando)
        }

        if (time > 86400000) {
            return replyMessage(client, interaction, "Error", "Troppo tempo", "Non puoi cancellare messaggi prima di 24 ore fa", comando)
        }

        let userMessages = []
        let totMessages = 0
        await interaction.guild.channels.cache.forEach(async channel => {
            if (channel.messages) {
                if (interaction.options.getString("mode") == "allchannels" || channel.id == interaction.channelId) {
                    let allMessages = [];
                    let lastMessage;

                    while (true) {
                        let options = { limit: 100 };
                        if (lastMessage) {
                            options.before = lastMessage;
                        }

                        let messages = await channel.messages.fetch(options)

                        allMessages = allMessages.concat(Array.from(messages.values()).filter(x => x.author.id == utente.id && x.createdTimestamp > Date.now() - time))

                        lastMessage = messages.last()?.id;

                        if (messages.size != 100 || messages.last().createdTimestamp < Date.now() - time) {
                            break
                        }
                    }

                    if (allMessages.length > 0)
                        userMessages.push({
                            channel: channel.id,
                            messages: allMessages
                        })

                    totMessages += allMessages.length
                }
            }
        })


        embed = new Discord.MessageEmbed()
            .setTitle("Ricerca messaggi...")
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Sto ricercando tutti i messaggi di ${utente.toString()} nel tempo desiderato`)

        interaction.reply({ embeds: [embed], fetchReply: true })
            .then(msg => {
                setTimeout(async () => {
                    if (totMessages == 0) {
                        embed = new Discord.MessageEmbed()
                            .setTitle("Nessun messaggio trovato")
                            .setColor(colors.gray)
                            .setDescription(`Non è stato trovato nessun messaggio di ${utente.toString()} nel tempo desiderato`)

                        msg.edit({ embeds: [embed] })
                        return
                    }

                    let totDeletedMessages = new Map()
                    userMessages.forEach(async x => {
                        let deletedMessages = new Map()
                        while (deletedMessages.size < x.messages.length) {
                            let daEliminare = (x.messages.length - deletedMessages.size) > 100 ? 100 : x.messages.length - deletedMessages.size

                            let fetched = x.messages.slice(daEliminare * -1)
                            userMessages[userMessages.findIndex(y => y.channel == x.channel)].messages = x.messages.slice(0, daEliminare * -1)

                            await client.channels.cache.get(x.channel).bulkDelete(fetched)

                            fetched = new Map(fetched.map(y => { return [y.id, y] }));

                            deletedMessages = new Map([...deletedMessages, ...fetched])
                            totDeletedMessages = new Map([...totDeletedMessages, ...fetched])

                            let embed = new Discord.MessageEmbed()
                                .setTitle(totDeletedMessages.size < totMessages ? "Eliminazione in corso..." : "Messaggi eliminati")
                                .setColor(totDeletedMessages.size < totMessages ? colors.yellow : colors.blue)
                                .setDescription(totDeletedMessages.size < totMessages ? `Messaggi di ${utente.toString()} eliminati: **${totDeletedMessages.size}**` : `Sono stati eliminati **${totDeletedMessages.size}** messaggi di ${utente.toString()}`)

                            msg.edit({ embeds: [embed] })
                                .then(msg => {
                                    if (totDeletedMessages.size >= totMessages)
                                        setTimeout(() => msg.delete(), 5000)
                                })

                            if (totDeletedMessages.size >= totMessages) {
                                let lastChannel = ""
                                let chatLog = ""
                                for (let msg of Array.from(totDeletedMessages.values()).reverse()) {
                                    if (lastChannel != msg.channel.id) chatLog += `${msg.channel.name}\n\n`
                                    lastChannel = msg.channel.id
                                    chatLog += `${msg.author.bot ? "[BOT] " : getUserPermissionLevel(client, msg.author.id) ? "[STAFF] " : ""}@${msg.author.tag} - ${moment(msg.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? msg.embeds.map(x => `\nEmbed: ${JSON.stringify(x)}`) : ""}${msg.attachments.size > 0 ? `\nAttachments: ${msg.attachments.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}${msg.stickers.size > 0 ? `\nStickers: ${msg.stickers.map(x => `[${x.name}](${x.url})`).join(", ")}` : ""}\n\n`
                                }

                                let attachment1
                                if (chatLog != "")
                                    attachment1 = await new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `clearuser-${utente.id}-${new Date().getTime()}.txt`);

                                let embed = new Discord.MessageEmbed()
                                    .setTitle(":axe: Clear user :axe:")
                                    .setColor(colors.purple)
                                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                    .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                                    .addField(":anchor: Channel", interaction.options.getString("mode") == "allchannels" ? "All channels" : `${interaction.channel.toString()} - #${interaction.channel.name}\nID: ${interaction.channelId}`)
                                    .addField(":incoming_envelope: Messages deleted", totDeletedMessages.size.toString())

                                if (!isMaintenance())
                                    client.channels.cache.get(log.moderation.clearuser).send({ embeds: [embed], files: attachment1 ? [attachment1] : [] })
                            }
                        }
                    })

                }, 1000 * 5)
            })
    }
};