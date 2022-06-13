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
    name: `guildBanAdd`,
    client: "moderation",
    async execute(client, ban) {
        if (isMaintenance()) return

        if (ban.guild.id != settings.idServer) return

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const logs = fetchedLogs.entries.first();
        if (!logs) return

        if (logs.executor.bot) return

        let embed = new Discord.MessageEmbed()
            .setTitle(":no_entry: Forceban :no_entry:")
            .setColor(colors.purple)
            .setThumbnail(logs.target.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Member", `${logs.target.toString()} - ${logs.target.tag}\nID: ${logs.target.id}`, false)
            .addField(":page_facing_up: Reason", logs.reason || "No reason", false)

        // client.channels.cache.get(log.moderation.forceban).send({ embeds: [embed] })

        let userstats = getUser(logs.target.id)
        if (!userstats) userstats = addUser(ban.guild.members.cache.get(logs.target.id) || logs.target)[0]

        userstats.moderation = {
            type: "Forcebanned",
            since: new Date().getTime(),
            until: null,
            reason: logs.reason || "No reason",
            moderator: logs.executor.id,
            ticketOpened: false
        }

        userstats.warns.push({
            type: "fban",
            reason: logs.reason || "No reason",
            time: new Date().getTime(),
            moderator: logs.executor.id,
            unTime: null,
            unModerator: null
        })

        updateUser(userstats)
    },
};