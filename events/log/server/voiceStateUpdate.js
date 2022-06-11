const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `voiceStateUpdate`,
    client: "general",
    async execute(client, oldState, newState) {
        if (isMaintenance(newState.id)) return

        if (newState.guild.id != settings.idServer) return

        if (!oldState.channelId && newState.channelId) {
            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Member joined :inbox_tray:")
                .setColor(colors.green)
                .setThumbnail(newState.guild.members.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ${client.users.cache.get(newState.id).tag}\nID: ${newState.id}`, false)
                .addField(":anchor: Channel", `${client.channels.cache.get(newState.channelId).toString()} - #${client.channels.cache.get(newState.channelId).name}\nID: ${newState.channelId}`)

            client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
        }
        else if (oldState.channelId && !newState.channelId) {
            const fetchedLogs = await oldState.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_DISCONNECT',
            });

            const logs = fetchedLogs.entries.first();

            let embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Member disconnetted :outbox_tray:")
                .setColor(colors.red)
                .setThumbnail(newState.guild.members.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (new Date().getTime() - logs.createdAt.getTime() < 7000 && logs.executor.id != oldState.id)
                embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ${client.users.cache.get(newState.id).tag}\nID: ${newState.id}`, false)
                .addField(":anchor: Channel", `${client.channels.cache.get(oldState.channelId).toString()} - #${client.channels.cache.get(oldState.channelId).name}\nID: ${oldState.channelId}`)

            client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
        }
        else {
            if (oldState.channelId != newState.channelId) {
                const fetchedLogs = await oldState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_MOVE',
                });

                const logs = fetchedLogs.entries.first();

                let embed = new Discord.MessageEmbed()
                    .setTitle(":twisted_rightwards_arrows: Member moved :twisted_rightwards_arrows:")
                    .setColor(colors.purple)
                    .setThumbnail(newState.guild.members.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

                if (logs.executor.id != oldState.id)
                    embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

                embed
                    .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ${client.users.cache.get(newState.id).tag}\nID: ${newState.id}`, false)
                    .addField(":ledger: From channel", `${client.channels.cache.get(oldState.channelId).toString()} - #${client.channels.cache.get(oldState.channelId).name}\nID: ${oldState.channelId}`)
                    .addField(":ledger: To channel", `${client.channels.cache.get(newState.channelId).toString()} - #${client.channels.cache.get(newState.channelId).name}\nID: ${newState.channelId}`)

                client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
            }
            else {
                const fetchedLogs = await newState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_UPDATE',
                });
                const logs = fetchedLogs.entries.first();

                let embed = new Discord.MessageEmbed()
                    .setTitle(":loud_sound: Member state update :loud_sound:")
                    .setColor(colors.purple)
                    .setThumbnail(newState.guild.members.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

                if (new Date().getTime() - logs.createdAt.getTime() < 7000 && logs.executor.id != oldState.id)
                    embed.addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)

                embed
                    .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ${client.users.cache.get(newState.id).tag}\nID: ${newState.id}`, false)
                    .addField(":anchor: Channel", `${client.channels.cache.get(oldState.channelId).toString()} - #${client.channels.cache.get(oldState.channelId).name}\nID: ${oldState.channelId}`)

                if (oldState.selfDeaf != newState.selfDeaf)
                    embed.addField(":ear: Ear self", !oldState.selfDeaf ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (oldState.selfMute != newState.selfMute)
                    embed.addField(":microphone2: Mic self", !oldState.selfMute ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (oldState.selfVideo != newState.selfVideo)
                    embed.addField(":camera: Video", oldState.selfVideo ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (oldState.streaming != newState.streaming)
                    embed.addField(":purple_circle: Streaming", oldState.streaming ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (oldState.serverDeaf != newState.serverDeaf)
                    embed.addField(":ear: Ear server", !oldState.serverDeaf ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (oldState.serverMute != newState.serverMute)
                    embed.addField(":microphone2: Mic server", !oldState.serverMute ? ":green_circle: > :red_circle:" : ":red_circle: > :green_circle:")

                if (embed.fields[3])
                    client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
            }
        }
    },
};