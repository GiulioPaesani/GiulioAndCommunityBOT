const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const illustrations = require("../../config/general/illustrations.json")
const { getAllUsers } = require("../../functions/database/getAllUsers")
const { updateUser } = require("../../functions/database/updateUser");
const { isMaintenance } = require("../../functions/general/isMaintenance");

const checkModeration = async (client) => {
    let server = client.guilds.cache.get(settings.idServer)
    let userstatsList = await getAllUsers(client)

    userstatsList.filter(x => x.moderation.type == "Tempmuted").forEach(userstats => {
        if (userstats.moderation.until <= new Date().getTime()) {
            if (server.members.cache.get(userstats.id)) {
                server.members.cache.get(userstats.id).roles.remove(settings.ruoliModeration.tempmuted)
                    .then(() => {
                        if (server.members.cache.get(userstats.id).voice?.channelId) {
                            let canale = server.members.cache.get(userstats.id).voice.channelId
                            if (canale == settings.idCanaliServer.general1)
                                server.members.cache.get(userstats.id).voice.setChannel(settings.idCanaliServer.general2)
                            else
                                server.members.cache.get(userstats.id).voice.setChannel(settings.idCanaliServer.general1)
                            server.members.cache.get(userstats.id).voice.setChannel(canale)
                        }
                    })
            }
            else {
                userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempmuted)
            }

            let utente = client.users.cache.get(userstats.id)
            if (utente.user) utente = utente.user

            embed = new Discord.MessageEmbed()
                .setTitle(":loud_sound: Unmute :loud_sound:")
                .setColor(colors.purple)
                .setThumbnail(server.members.cache.get(utente.id).displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${client.user.toString()} - ${client.user.tag}\nID: ${client.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                .addField(":page_facing_up: Mute reason", userstats.moderation.reason)
                .addField(":hourglass: Time muted", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.unmute).send({ embeds: [embed] })

            embed = new Discord.MessageEmbed()
                .setTitle("Sei stato smutato")
                .setColor(colors.purple)
                .setThumbnail(illustrations.mute)
                .addField(":page_facing_up: Mute reason", userstats.moderation.reason)
                .addField(":hourglass: Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

            utente.send({ embeds: [embed] })
                .catch(() => { })

            userstats.moderation = {
                type: "",
                since: null,
                until: null,
                reason: null,
                moderator: null,
                ticketOpened: false
            }

            let reverseWarns = [...userstats.warns].reverse()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "mute" || x.type == "tempmute")].unTime = new Date().getTime()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "mute" || x.type == "tempmute")].unModerator = client.user.id

            updateUser(userstats)
        }
    })

    userstatsList.filter(x => x.moderation.type == "Tempbanned").forEach(userstats => {
        if (userstats.moderation.until <= new Date().getTime()) {
            if (server.members.cache.get(userstats.id)) {
                server.members.cache.get(userstats.id).roles.remove(settings.ruoliModeration.tempbanned)
                    .then(() => {
                        if (server.members.cache.get(userstats.id).voice?.channelId) {
                            server.members.cache.get(userstats.id).voice.disconnect()
                        }
                    })
            }
            else {
                userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempbanned)
            }

            let utente = client.users.cache.get(userstats.id)
            if (utente.user) utente = utente.user

            embed = new Discord.MessageEmbed()
                .setTitle(":name_badge: Unban :name_badge:")
                .setColor(colors.purple)
                .setThumbnail(server.members.cache.get(utente.id).displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${client.user.toString()} - ${client.user.tag}\nID: ${client.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
                .addField(":hourglass: Time banned", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })

            embed = new Discord.MessageEmbed()
                .setTitle("Sei stato sbannato")
                .setColor(colors.purple)
                .setThumbnail(illustrations.ban)
                .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
                .addField(":hourglass: Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

            utente.send({ embeds: [embed] })
                .catch(() => { })

            userstats.moderation = {
                type: "",
                since: null,
                until: null,
                reason: null,
                moderator: null,
                ticketOpened: false
            }

            let reverseWarns = [...userstats.warns].reverse()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unTime = new Date().getTime()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unModerator = client.user.id

            updateUser(userstats)
        }
    })
}

module.exports = { checkModeration }