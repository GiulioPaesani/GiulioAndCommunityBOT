const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUser } = require('../../../functions/database/getUser');
const { addUser } = require('../../../functions/database/addUser');
const { updateUser } = require('../../../functions/database/updateUser');

module.exports = {
    name: `guildBanRemove`,
    async execute(client, ban) {
        if (isMaintenance()) return

        if (ban.guild.id != settings.idServer) return

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });

        const logs = fetchedLogs.entries.first();
        if (!logs) return

        if (logs.executor.bot) return

        let userstats = await getUser(logs.target.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(logs.target.id) || logs.target)

        let embed = new Discord.MessageEmbed()
            .setTitle(":name_badge: Unban :name_badge:")
            .setColor(colors.purple)
            .setThumbnail(logs.target.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Member", `${logs.target.toString()} - ${logs.target.tag}\nID: ${logs.target.id}`, false)

        if (userstats.moderation.type == "Forcebanned" && !logs.target.bot) {
            embed
                .addField(":page_facing_up: Ban reason", userstats.moderation.reason || "No reason", false)
                .addField(":hourglass: Time banned", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)

            userstats.moderation = {
                type: "",
                since: null,
                until: null,
                reason: null,
                moderator: null,
                ticketOpened: false
            }

            let reverseWarns = [...userstats.warns].reverse()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unTime = new Date().getTime()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unModerator = logs.executor.id

            updateUser(userstats)
        }
        else {
            embed
                .addField(":page_facing_up: Ban reason", ban.reason || "No reason", false)
        }

        client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })
    },
};