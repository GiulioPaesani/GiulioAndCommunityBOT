const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `roleDelete`,
    async execute(client, role) {
        const maintenanceStates = await isMaintenance()
        if (maintenanceStates) return

        if (role.guild.id != settings.idServer) return

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });
        const logs = fetchedLogs.entries.first();
        if (!logs) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Role deleted :wastebasket:")
            .setColor(colors.red)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":shirt: Role", `@${role.name} - ID: ${role.id}`)
            .addField(":rainbow: Color", `#${role.color.toString(16)}`)
            .addField(":1234: Position", role.rawPosition.toString())

        if (role.permissions.toArray().length > 0)
            embed.addField(":gem: Permissions", role.permissions.toArray().join("\n"))

        client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
    },
};