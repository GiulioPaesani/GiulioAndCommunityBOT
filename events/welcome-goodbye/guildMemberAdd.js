const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { invites } = require("../../functions/general/invites")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { addUser } = require("../../functions/database/addUser")

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        const maintenanceStates = await isMaintenance(member.user.id)
        if (maintenanceStates) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        member.guild.invites.fetch()
            .then(guildInvites => {
                invites[member.guild.id] = guildInvites;
            })

        let userstats = await getUser(interaction.user.id)

        if (!userstats || !userstats.joinedAt) {
            addUser(interaction.member)

            interaction.message.guild.invites.fetch().then(async guildInvites => {
                const ei = invites.get(interaction.message.guild.id);
                const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Welcome :inbox_tray:")
                    .setColor(colors.green)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.member.toString()} - ${interaction.user.tag}\nID: ${interaction.member.id}`)
                    .addField(":pencil: Account created", `${moment(interaction.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(interaction.user.createdAt).fromNow()})`)
                    .addField(":love_letter: Invite", invite ? `${invite.code} - Created by: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })
            })
        }
        else {
            let roles = ""
            userstats.roles.forEach(role => {
                if (interaction.member.guild.roles.cache.get(role)) {
                    roles += `@${interaction.member.guild.roles.cache.get(role).name} - ID: ${role}\n`
                }
            })

            interaction.member.guild.invites.fetch().then(async guildInvites => {
                const ei = invites.get(interaction.member.guild.id);
                const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Welcome back :inbox_tray:")
                    .setColor(colors.green)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                    .addField(":bust_in_silhouette: Member", `${interaction.member.toString()} - ${interaction.member.user.tag}\nID: ${interaction.member.id}`)
                    .addField(":pencil: Account created", `${moment(interaction.member.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(interaction.member.user.createdAt).fromNow()})`)
                    .addField(":red_car: Leaved server", `${moment(userstats.leavedAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(userstats.leavedAt).fromNow()})`)
                    .addField(":love_letter: Invite", invite ? `${invite.code} - Created by: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)` : "User joined by Server Discovery")
                    .addField(":shirt: Roles", roles || "_No roles_")

                const maintenanceStatus = await isMaintenance()
                if (!maintenanceStatus)
                    client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

                userstats.leavedAt = null

                if (userstats.roles.length != 0) {
                    userstats.roles = [];
                }
                updateUser(userstats)
            })

        }
    }
}