const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { addUser } = require("../../functions/database/addUser")
const { getAllUsers } = require("../../functions/database/getAllUsers")

module.exports = {
    name: "guildMemberRemove",
    client: "general",
    async execute(client, member) {
        if (isMaintenance(member.user.id)) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        if (member.roles.cache.has(settings.idRuoloNonVerificato)) return

        let userstats = getUser(member.id)
        if (!userstats) userstats = addUser(member)[0]

        userstats.roles = member._roles;
        userstats.leavedAt = new Date().getTime();

        updateUser(userstats);

        let roles = ""
        member._roles.forEach(role => {
            if (member.guild.roles.cache.get(role))
                roles += `@${member.guild.roles.cache.get(role).name} - ID: ${role}\n`
        })

        let embed = new Discord.MessageEmbed()
            .setTitle(":outbox_tray: Goodbye :outbox_tray:")
            .setColor(colors.red)
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${member.toString()} - ${member.user.tag}\rID: ${member.id}`)
            .addField(":red_car: Joined server", `${moment(member.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(member.joinedTimestamp).fromNow()})`)
            .addField(":shirt: Roles", roles || "_No roles_")

        if (!isMaintenance())
            client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

        let userstatsList = getAllUsers(client)
        userstatsList.filter(x => x.invites[member.user.id]).forEach(userstats2 => {
            userstats2.invites[member.user.id] = "leaved"
            updateUser(userstats2)
        })
    }
}