const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { addUser } = require("../../../functions/database/addUser")
const { getUser } = require("../../../functions/database/getUser")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels")

const groupSpam = new Map()

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (getUserPermissionLevel(client, message.author.id) >= 2) return

        let userstats = await getUser(message.author.id)
        if (!userstats) userstats = await addUser(message.member)

        if (hasSufficientLevels(client, userstats, 10)) return

        if (groupSpam.has(message.channel.id)) {
            let channel = groupSpam.get(message.channel.id)

            if (message.createdTimestamp - channel.lastMessage <= 2000) {
                if (!channel.users.includes(message.author.id)) channel.users.push(message.author.id)
                channel.lastMessage = message.createdTimestamp
                channel.msgCount++

                if (channel.msgCount >= 10) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(":skull: Lockdown ATTIVATO :skull:")
                        .setColor(colors.red)
                        .setThumbnail(illustrations.lockdownOn)
                        .setDescription(`È appena stato attivato il **sistema di lockdown** per una rilevazione di **spam eccessivo**
                
Tutti gli utenti con inferiori al ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == "Level 10").toString()} non vedranno piu nessun canale fino alla disattivazione di questo sistema`)

                    message.channel.send({ embeds: [embed] })
                        .then(msg => {
                            let memberList = ""
                            channel.users.forEach(userId => {
                                memberList += `${client.users.cache.get(userId).toString()} - ${client.users.cache.get(userId).tag}\nID: ${userId}\n`
                            })

                            let embed = new Discord.MessageEmbed()
                                .setTitle(":thought_balloon: Group spam :thought_balloon:")
                                .setColor(colors.purple)
                                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                .addField(":anchor: Channel", `${message.channel.toString()} - #${message.channel.name}\nID: ${message.channel.id}`)
                                .addField(":bust_in_silhouette: Members", memberList)

                            if (!isMaintenance())
                                client.channels.cache.get(log.moderation.spam).send({ embeds: [embed] })
                        })

                    let everyone = interaction.guild.roles.everyone
                    everyone.setPermissions(["SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY", "USE_VAD", "USE_EXTERNAL_EMOJIS"])

                    let canale = client.channels.cache.get(settings.idCanaliServer.lockdown);
                    canale.permissionOverwrites.edit(everyone, {
                        VIEW_CHANNEL: true,
                    })
                    canale.messages.fetch()
                        .then(messages => {
                            embed = new Discord.MessageEmbed()
                                .setTitle(":skull: Lockdown ATTIVATO :skull:")
                                .setColor(colors.red)
                                .setThumbnail(illustrations.lockdownOn)
                                .setDescription(`È appena stato attivato il **sistema di lockdown** automaticamente per una rilevazione di **spam eccessivo**
:bangbang: Tutti gli utenti che ancora non hanno raggiunto il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level 10`).toString()} non vedranno **nessuna chat**, tranne questa. Mentre per tutti gli altri il server resta invariato

Scusate per il disagio, a breve il sistema verrà disattivato dallo staff e potrete continuare a partecipare al server`)


                            Array.from(messages.values())[0].edit({ embeds: [embed] })
                        })

                    if (interaction.channelId != settings.idCanaliServer.general)
                        client.channels.cache.get(settings.idCanaliServer.general).send({ embeds: [embed] })

                    groupSpam.delete(message.channel.id);
                    return
                }
            }
            else {
                channel.msgCount = 1
                channel.lastMessage = message.createdTimestamp
                channel.users = [message.author.id]
                groupSpam.set(message.channel.id, channel)
            }
        }
        else {
            groupSpam.set(message.channel.id, {
                msgCount: 1,
                lastMessage: message.createdTimestamp,
                users: []
            })
        }
    },
};