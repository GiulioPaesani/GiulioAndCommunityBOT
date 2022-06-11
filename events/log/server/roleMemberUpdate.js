const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `guildMemberUpdate`,
    client: "general",
    async execute(client, oldMember, newMember) {
        if (isMaintenance()) return

        if (newMember.guild.id != settings.idServer) return

        if (oldMember._roles != newMember._roles) {
            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.changes.find(x => x.key == "$add")) {
                let roles = ""
                logs.changes.find(x => x.key == "$add").new.forEach(element => {
                    roles += `@${element.name} - ID: ${element.id}\n`
                });

                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Role added :inbox_tray:")
                    .setColor(colors.purple)
                    .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`)
                    .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ${newMember.user.tag}\nID: ${newMember.id}`, false)
                    .addField(":shirt: Role", roles)

                client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
            }

            if (logs.changes.find(x => x.key == "$remove")) {
                let roles = ""
                logs.changes.find(x => x.key == "$remove").new.forEach(element => {
                    roles += `@${element.name} - ID: ${element.id}\n`
                });

                let embed = new Discord.MessageEmbed()
                    .setTitle(":outbox_tray: Role removed :outbox_tray:")
                    .setColor(colors.purple)
                    .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`)
                    .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ${newMember.user.tag}\nID: ${newMember.id}`, false)
                    .addField(":shirt: Role", roles)

                client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
            }
        }
    },
};