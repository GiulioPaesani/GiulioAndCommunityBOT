const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { invites } = require("../../../functions/general/invites")

module.exports = {
    name: `inviteDelete`,
    client: "general",
    async execute(client, invite) {
        invites.get(invite.guild.id).delete(invite.code);

        if (isMaintenance()) return

        if (invite.guild.id != settings.idServer) return

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_DELETE',
        });
        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Invite deleted :wastebasket:")
            .setColor(colors.red)
            .setThumbnail(invite.guild.members.cache.get(logs.changes.find(x => x.key == "inviter_id").old).displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Inviter", `${client.users.cache.get(logs.changes.find(x => x.key == "inviter_id").old).toString()} - ${invite.guild.members.cache.get(logs.changes.find(x => x.key == "inviter_id").old).user.tag}\rID: ${logs.changes.find(x => x.key == "inviter_id").old}`, false)
            .addField(":link: Code", logs.changes.find(x => x.key == "code").old, false)
            .addField(":razor: Max uses", logs.changes.find(x => x.key == "max_uses").old == 0 ? "∞" : logs.changes.find(x => x.key == "max_uses").old, false)
            .addField(":hourglass_flowing_sand: Expire time", logs.changes.find(x => x.key == "max_age").old == 0 ? "Never" : ms(logs.changes.find(x => x.key == "max_age").old * 1000, { long: true }), false)
            .addField(":pill: Temponary", logs.changes.find(x => x.key == "temporary").old ? "Yes" : "No", false)
            .addField(":anchor: Channel", `${invite.channel.toString()} - #${invite.channel.name}\nID: ${invite.channel.id}`)

        client.channels.cache.get(log.server.invites).send({ embeds: [embed] })
    },
};