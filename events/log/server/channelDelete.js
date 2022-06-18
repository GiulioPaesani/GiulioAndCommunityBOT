const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `channelDelete`,
    async execute(client, channel) {
        if (isMaintenance()) return

        if (channel.guild.id != settings.idServer) return

        if (!channel.guild) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_DELETE',
        });
        const logs = fetchedLogs.entries.first();

        if (new Date().getTime() - logs.createdAt.getTime() > 7000) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Channel deleted :wastebasket:")
            .setColor(colors.red)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`)
            .addField(":anchor: Channel", `#${channel.name} - ID: ${channel.id}`)
            .addField(":bricks: Category", channel.parentId ? `${channel.parent.toString()} - ID: ${channel.parent.id}` : "_Null_")
            .addField(":thought_balloon: Type", channel.type == "GUILD_TEXT" ? "Text" : channel.type == "GUILD_VOICE" ? "GUILD_VOICE" : channel.type)
            .addField(":notepad_spiral: Topic", channel.topic ? (channel.topic.length > 1024 ? `${channel.topic.slice(0, 1021)}...` : channel.topic) : "_Null_")

        let permissionsText = ""
        Array.from(channel.permissionOverwrites.cache.values()).forEach(permission => {
            permissionsText += permission.type == "member" ? `User: <@${permission.id}> - ID: ${permission.id}\n` : `Role: @${channel.guild.roles.cache.find(y => y.id == permission.id).name}\n`

            let permissionsAllow = permission.allow.serialize() || {}
            let permissionsDeny = permission.deny.serialize() || {}

            let permissions = { ...permissionsAllow }
            for (let permission2 in permissions) {
                if (!permissionsAllow[permission2] && !permissionsDeny[permission2])
                    permissions[permission2] = 0
                else if (permissionsAllow[permission2] && !permissionsDeny[permission2])
                    permissions[permission2] = 1
                else if (!permissionsAllow[permission2] && permissionsDeny[permission2])
                    permissions[permission2] = -1
            }

            for (let permission3 in permissions) {
                if (permissions[permission3] != 0)
                    permissionsText += `${permission3} - ${permissions[permission3] == -1 ? ":red_circle:" : ":green_circle:"}\n`
            }
        })

        if (permissionsText != "")
            embed.addField(":gem: Permissions", permissionsText.length > 1024 ? `${permissionsText.slice(0, 1021)}...` : permissionsText)

        client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
    },
};