const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { addUser } = require("../../functions/database/addUser")
const { getAllUsers } = require("../../functions/database/getAllUsers")

module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
        const maintenanceStates = await isMaintenance(member.user.id)
        if (maintenanceStates) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        if (member.roles.cache.has(settings.idRuoloNonVerificato)) return

        let userstats = await getUser(member.id)
        if (!userstats) userstats = await addUser(member)

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
            .addField(":bust_in_silhouette: Member", `${member.toString()} - ${member.user.tag}\nID: ${member.id}`)
            .addField(":red_car: Joined server", `${moment(member.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(member.joinedTimestamp).fromNow()})`)
            .addField(":shirt: Roles", roles || "_No roles_")

        const maintenanceStatus = await isMaintenance()
        if (!maintenanceStatus)
            client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })
    }
}