const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `guildMemberUpdate`,
    client: "general",
    async execute(client, oldMember, newMember) {
        if (isMaintenance(newMember.user.id)) return

        if (newMember.guild.id != settings.idServer) return

        if (!oldMember.nickname && newMember.nickname) {
            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return

            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Nickname setted :inbox_tray:")
                .setColor(colors.green)
                .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ${newMember.user.tag}\nID: ${newMember.id}`, false)
                .addField(":placard: Nickname", `Old: _Null_\rNew: ${newMember.nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            embed = new Discord.MessageEmbed()
                .setTitle(":green_circle: Nickname inserito :green_circle:")
                .setColor(colors.green)
                .setThumbnail(illustrations.nickname)
                .setDescription(`${logs.executor.toString()} ti ha inserito un **nickname** nel server`)
                .addField(":placard: Nickname", newMember.nickname)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
        else if (oldMember.nickname && !newMember.nickname) {

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return

            let embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Nickname removed :outbox_tray:")
                .setColor(colors.red)
                .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ${newMember.user.tag}\nID: ${newMember.id}`, false)
                .addField(":placard: Nickname", `Old: ${oldMember.nickname}\rNew: _Null_`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            embed = new Discord.MessageEmbed()
                .setTitle(":red_circle: Nickname resettato :red_circle:")
                .setColor(colors.red)
                .setThumbnail(illustrations.nickname)
                .setDescription(`${logs.executor.toString()} ha resettato il tuo **nickname** nel server`)
                .addField(":placard: Old Nickname", oldMember.nickname)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
        else if (newMember.nickname && oldMember.nickname != newMember.nickname) {

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return

            let embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Nickname updated :pencil:")
                .setColor(colors.yellow)
                .setThumbnail(newMember.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ${newMember.user.tag}\nID: ${newMember.id}`, false)
                .addField(":placard: Nickname", `Old: ${oldMember.nickname}\rNew: ${newMember.nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            embed = new Discord.MessageEmbed()
                .setTitle(":yellow_circle: Nickname cambiato :yellow_circle:")
                .setColor(colors.yellow)
                .setThumbnail(illustrations.nickname)
                .setDescription(`${logs.executor.toString()} ha cambiato il tuo **nickname** nel server`)
                .addField(":placard: New Nickname", newMember.nickname)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
    },
};