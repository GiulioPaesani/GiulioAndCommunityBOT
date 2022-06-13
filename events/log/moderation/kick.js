const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUser } = require('../../../functions/database/getUser');
const { addUser } = require('../../../functions/database/addUser');
const { updateUser } = require('../../../functions/database/updateUser');

module.exports = {
    name: `guildMemberRemove`,
    client: "moderation",
    async execute(client, member) {
        if (isMaintenance()) return

        if (member.guild.id != settings.idServer) return

        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });

        const logs = fetchedLogs.entries.first();
        if (!logs) return

        if (new Date().getTime() - logs.createdAt.getTime() > 10000) return

        if (logs.executor.bot) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":ping_pong: Kick :ping_pong:")
            .setColor(colors.purple)
            .setThumbnail(logs.target.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Member", `${logs.target.toString()} - ${logs.target.tag}\nID: ${logs.target.id}`, false)
            .addField(":page_facing_up: Reason", logs.reason || "No reason", false)

        // client.channels.cache.get(log.moderation.kick).send({ embeds: [embed] })

        let userstats = getUser(logs.target.id)
        if (!userstats) userstats = addUser(member.guild.members.cache.get(logs.target.id) || logs.target)[0]

        userstats.warns.push({
            type: "kick",
            reason: logs.reason || "No reason",
            time: new Date().getTime(),
            moderator: logs.executor.id
        })

        updateUser(userstats)
    },
};