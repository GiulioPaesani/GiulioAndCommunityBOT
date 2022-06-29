const Discord = require("discord.js")
const moment = require("moment")
const fs = require("fs")
const settings = require("../../config/general/settings.json")
const log = require("../../config/general/log.json")
const colors = require("../../config/general/colors.json")
const { fetchAllMessages } = require("../../functions/general/fetchAllMessages")
const { getServer } = require("../../functions/database/getServer")
const { getAllUsers } = require("../../functions/database/getAllUsers")

const autoBackup = async (client) => {
    let data = new Date()
    if (data.getMinutes() != 0 || data.getSeconds() != 0) return

    if (![2, 6, 10, 14, 18, 22].includes(data.getHours())) return

    let server = client.guilds.cache.get(settings.idServer)
    let time = new Date().getTime()

    let backup = {
        info: {
            time: time,
            moderator: null
        },
        guild: {
            name: "",
            description: "",
            icon: "",
            banner: "",
            bans: [],
            emojis: [],
            stickers: []
        },
        roles: [],
        categories: [],
        channels: [],
        mainMessages: [],
        thingsToDo: [],
    }

    //Guild
    backup.guild.name = server.name
    backup.guild.description = server.description
    backup.guild.icon = server.iconURL({ size: 1024, dynamic: true, format: "png" })
    backup.guild.banner = server.bannerURL({ size: 1024, dynamic: true, format: "png" })
    await server.bans.fetch()
        .then(async banned => {
            banned.forEach(ban => backup.guild.bans.push(ban.user.id))
        })

    await server.emojis.cache.forEach(emoji => {
        backup.guild.emojis.push({
            name: emoji.name,
            url: emoji.url
        })
    })

    await server.stickers.cache.forEach(sticker => {
        backup.guild.stickers.push({
            name: sticker.name,
            description: sticker.description,
            emoji: sticker.tags[0],
            url: sticker.url
        })
    })

    //Roles
    let ruoli = server.roles.cache.sort((a, b) => b.position - a.position)
    for (let ruolo of Array.from(ruoli.values())) {
        backup.roles.push({
            name: ruolo.name,
            color: ruolo.color,
            hoist: ruolo.hoist,
            mentionable: ruolo.mentionable,
            icon: ruolo.iconURL({ size: 1024, format: "png" }),
            permissions: Array.from(ruolo.permissions)
        })
    }

    //Categories
    let categorie = await server.channels.cache.filter(x => x.type == "GUILD_CATEGORY").sort((a, b) => a.position - b.position)
    for (let categoria of Array.from(categorie.values())) {
        let channelPermissions = []
        Array.from(categoria.permissionOverwrites.cache.values()).forEach(permission => {
            channelPermissions.push({
                type: permission.type,
                id: permission.type == "member" ? permission.id : server.roles.cache.get(permission.id).name,
                deny: Array.from(permission.deny),
                allow: Array.from(permission.allow)
            })
        })

        backup.categories.push({
            name: categoria.name,
            permissions: channelPermissions
        })
    }

    //Channels
    let channels = await server.channels.cache.filter(x => x.type != "GUILD_CATEGORY" && !x.type.endsWith("THREAD")).sort((a, b) => a.position - b.position)
    for (let canale of Array.from(channels.values())) {
        let channelPermissions = []
        Array.from(canale.permissionOverwrites.cache.values()).forEach(permission => {
            channelPermissions.push({
                type: permission.type,
                id: permission.type == "member" ? permission.id : server.roles.cache.get(permission.id).name,
                deny: Array.from(permission.deny),
                allow: Array.from(permission.allow)
            })
        })

        backup.channels.push({
            name: canale.name,
            type: canale.type,
            topic: canale.topic,
            category: canale.parentId ? server.channels.cache.get(canale.parentId).name : null,
            slowmode: canale.rateLimitPerUser,
            bitrate: canale.bitrate,
            userlimit: canale.userLimit,
            permissions: channelPermissions
        })
    }

    //Main channels
    channels = [
        settings.idCanaliServer.rules,
        settings.idCanaliServer.info,
        settings.idCanaliServer.suggestions,
        settings.idCanaliServer.polls,
        settings.idCanaliServer.staffPolls,
        settings.idCanaliServer.qna,
        settings.idCanaliServer.ourProjects,
        settings.idCanaliServer.faq,
        settings.idCanaliServer.help,
        settings.idCanaliServer.support,
        settings.idCanaliServer.privateRooms,
        settings.idCanaliServer.joinTheServer,
        settings.idCanaliServer.lockdown,
        settings.idCanaliServer.mutedTicket,
        settings.idCanaliServer.tempmutedTicket,
        settings.idCanaliServer.bannedTicket,
        settings.idCanaliServer.tempbannedTicket,
    ]

    for (let canale of channels) {
        canale = client.channels.cache.get(canale)
        let mainMessages = []
        await fetchAllMessages(canale)
            .then(messages => {
                for (let msg of messages) {
                    let content = msg.content
                    let embeds = JSON.stringify(msg.embeds)

                    server.channels.cache.forEach(x => content = content.replace(eval(`/<#${x.id}>/g`), `#${x.name}`))
                    server.roles.cache.forEach(x => content = content.replace(eval(`/<@&${x.id}>/g`), `@${x.name}`))

                    server.channels.cache.forEach(x => embeds = embeds.replace(eval(`/<#${x.id}>/g`), `#${x.name}`))
                    server.roles.cache.forEach(x => embeds = embeds.replace(eval(`/<@&${x.id}>/g`), `@${x.name}`))

                    mainMessages.push({
                        embeds: JSON.parse(embeds),
                        content: content,
                        attachments: msg.attachments.map(x => x.url),
                        components: msg.components
                    })
                }
            })

        if (mainMessages.length > 0)
            backup.mainMessages.push({
                channel: canale.name,
                messages: mainMessages
            })
    }

    //Things to do
    await fetchAllMessages(client.channels.cache.get(log.general.thingsToDo))
        .then(messages => {
            for (let msg of messages) {
                let content = msg.embeds[0]?.fields[1]?.value || msg.embeds[0]?.fields[0]?.value
                if (content) {
                    server.channels.cache.forEach(x => content = content.replace(eval(`/<#${x.id}>/g`), `#${x.name}`))
                    server.roles.cache.forEach(x => content = content.replace(eval(`/<@&${x.id}>/g`), `@${x.name}`))

                    backup.thingsToDo.push({
                        content: content,
                        status: msg.embeds[0].fields[0].value
                    })
                }
            }
        })

    let serverstats = await getServer()
    let userstatsList = await getAllUsers(client, false)

    const attachmentServer = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(backup, null, "\t"), "utf-8"), `backup-server-${time}.json`);
    const attachmentServerstats = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(serverstats, null, "\t"), "utf-8"), `backup-serverstats-${time}.json`);
    const attachmentUserstats = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(userstatsList, null, "\t"), "utf-8"), `backup-userstats-${time}.json`);

    embed = new Discord.MessageEmbed()
        .setTitle(":inbox_tray: Auto backup :inbox_tray:")
        .setColor(colors.purple)
        .addField(":alarm_clock: Time", moment(time).format("ddd DD MMM YYYY, HH:mm:ss"))

    client.channels.cache.get(log.general.backup).send({ embeds: [embed] })
        .then(async () => {
            await client.channels.cache.get(log.general.backup).send({ files: [attachmentServer] })
            await client.channels.cache.get(log.general.backup).send({ files: [attachmentServerstats] })
            await client.channels.cache.get(log.general.backup).send({ files: [attachmentUserstats] })
        })
}

module.exports = { autoBackup }