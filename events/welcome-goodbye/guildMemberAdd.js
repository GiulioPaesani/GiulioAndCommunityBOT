const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const illustrations = require("../../config/general/illustrations.json")
const log = require("../../config/general/log.json")
const { invites } = require("../../functions/general/invites")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { getAllUsers } = require("../../functions/database/getAllUsers")
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

        client.channels.cache.get(settings.idCanaliServer.joinTheServer).send(member.toString())
            .then(msg => msg.delete().catch(() => { }))
    }
}