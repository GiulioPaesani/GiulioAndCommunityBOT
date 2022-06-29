const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { addUser } = require("../../../functions/database/addUser")
const { getUser } = require("../../../functions/database/getUser")
const { updateUser } = require("../../../functions/database/updateUser")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")

const individualSpam = new Map()

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (getUserPermissionLevel(client, message.author.id) >= 2) return

        let userstats = await getUser(message.author.id)
        if (!userstats) userstats = await addUser(message.member)

        if (individualSpam.has(message.author.id)) {
            const user = individualSpam.get(message.author.id);
            if (message.createdTimestamp - user.lastMessage <= 2000) {
                user.msgCount++
                if (user.msgCount >= 7) {
                    individualSpam.delete(message.author.id);

                    message.guild.channels.cache.forEach((canale) => {
                        if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket) {
                            canale.permissionOverwrites?.edit(settings.ruoliModeration.tempmuted, {
                                SEND_MESSAGES: false,
                                SEND_MESSAGES_IN_THREADS: false,
                                ADD_REACTIONS: false,
                                SPEAK: false
                            })
                        }
                    })

                    message.member.roles.add(settings.ruoliModeration.tempmuted)
                        .then(async () => {
                            if (message.member.voice?.channelId) {
                                let canale = message.member.voice.channelId
                                if (canale == settings.idCanaliServer.general1)
                                    message.member.voice.setChannel(settings.idCanaliServer.general2)
                                else
                                    message.member.voice.setChannel(settings.idCanaliServer.general1)
                                message.member.voice.setChannel(canale)
                            }
                        })

                    let time = 600000;
                    let reason = "Flood messaggi ripetuti e fastidiosi";

                    userstats.moderation = {
                        type: "Tempmuted",
                        since: new Date().getTime(),
                        until: moment().add(time, "ms").valueOf(),
                        reason: reason,
                        moderator: client.user.id,
                        ticketOpened: false
                    }
                    userstats.warns.push({
                        type: "tempmute",
                        reason: reason,
                        time: new Date().getTime(),
                        moderator: client.user.id,
                        unTime: null,
                        unModerator: null
                    })
                    updateUser(userstats)

                    let embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `[TEMPMUTE] ${message.member.nickname || message.author.username}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(illustrations.mute)
                        .setColor(colors.purple)
                        .addField(":page_facing_up: Reason", reason)
                        .addField(":hourglass: Time", ms(time, { long: true }))
                        .setFooter({ text: "User ID: " + message.author.id })

                    let msg = await message.channel.send({ embeds: [embed] })

                    embed = new Discord.MessageEmbed()
                        .setTitle(":thought_balloon: Individual spam :thought_balloon:")
                        .setColor(colors.purple)
                        .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
                        .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                        .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ${message.author.tag}\nID: ${message.author.id}`)
                        .addField(":anchor: Channel", `${message.channel.toString()} - #${message.channel.name}\nID: ${message.channel.id}`)

                    const maintenanceStatus = await isMaintenance()
                    if (!maintenanceStatus)
                        client.channels.cache.get(log.moderation.spam).send({ embeds: [embed] })

                    embed = new Discord.MessageEmbed()
                        .setTitle(":speaker: Tempmute :speaker:")
                        .setColor(colors.purple)
                        .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }))
                        .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                        .addField(":brain: Executor", `${client.user.toString()} - ${client.user.tag}\nID: ${client.user.id}`)
                        .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ${message.author.tag}\nID: ${message.author.id}`)
                        .addField(":hourglass: Duration", `${ms(time, { long: true })} (Until: ${moment().add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`)
                        .addField(":page_facing_up: Reason", reason)

                    if (!maintenanceStatus)
                        client.channels.cache.get(log.moderation.tempmute).send({ embeds: [embed] })

                    embed = new Discord.MessageEmbed()
                        .setTitle("Sei stato mutato temporaneamente")
                        .setColor(colors.purple)
                        .setThumbnail(illustrations.mute)
                        .addField(":page_facing_up: Reason", reason)
                        .addField(":hourglass: Time", ms(time, { long: true }))

                    message.member.send({ embeds: [embed] })
                        .catch(() => { })
                    return
                }

                user.lastMessage = message.createdTimestamp;

                individualSpam.set(message.author.id, user)
            }
            else {
                user.msgCount = 1
                user.lastMessage = message.createdTimestamp
                individualSpam.set(message.author.id, user)
            }
        }
        else {
            individualSpam.set(message.author.id, {
                msgCount: 1,
                lastMessage: message.createdTimestamp
            });
        }
    },
};


