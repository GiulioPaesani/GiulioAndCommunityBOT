const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `roleCreate`,
    client: "general",
    async execute(client, role) {
        if (isMaintenance()) return

        if (role.guild.id != settings.idServer) return

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Role created :mouse_three_button:")
            .setColor(colors.green)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":shirt: Role", `@${role.name} - ID: ${role.id}`)

        client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
    },
};