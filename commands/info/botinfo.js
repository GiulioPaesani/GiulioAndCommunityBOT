const Discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const changelogs = require("../../config/general/changelogs.json")
const { version } = require("../../package.json")
const { getServer } = require("../../functions/database/getServer")
const { musicBots, clientModeration, clientFun, clientRanking } = require("../../index");
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "botinfo",
    description: "Visualizzare informazioni sul bot",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/botinfo",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let serverstats = getServer()
        const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance.local : serverstats.maintenance.host

        let embed = new Discord.MessageEmbed()
            .setTitle(client.user.tag)
            .setThumbnail(client.user.avatarURL({ size: 1024 }))
            .setDescription("Informazione su questo bot all'interno del server")
            .addField(":turtle: Ping", `${client.ws.ping}ms`, true)
            .addField(":floppy_disk: Ram", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField(":stopwatch: Uptime", `${ms(client.uptime, { long: true })} - ${moment(new Date().getTime() - client.uptime).format("ddd DD MMM, HH:mm:ss")}`, true)
            .addField(":pencil: Created at", `${moment(client.user.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(client.user.createdAt).fromNow()})`, true)
            .addField(":bar_chart: Info", `Tot commands: ${client.commands.size}\nTot events: ${client.events}\n`, true)
            .addField(":clipboard: Version", `${version}\n([Last changelog](https://youtu.be/${changelogs.sort((a, b) => moment(a.date) > moment(b.date) ? 1 : -1)[changelogs.length - 1].idVideo}))`, true)
            .addField(":construction: Maintenance", maintenanceStates == 0 ? `Off - Everyone can use bot` : maintenanceStates == 1 ? `Mode 1 - Only tester can use bot` : maintenanceStates == 2 ? `Mode 2 - Nobody can use bot` : maintenanceStates == 3 ? `Mode 3 - Everyone, except testers, can use bot` : "", true)

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`botinfoMenu,${interaction.user.id}`)
            .setPlaceholder('Select bot...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: client.user.username,
                emoji: getEmoji(client, client.user.username.replace(" ", "")),
                value: client.user.id,
            })
            .addOptions({
                label: clientFun.user.username,
                emoji: getEmoji(client, clientFun.user.username),
                value: clientFun.user.id,
            })
            .addOptions({
                label: clientModeration.user.username,
                emoji: getEmoji(client, clientModeration.user.username),
                value: clientModeration.user.id,
            })
            .addOptions({
                label: clientRanking.user.username,
                emoji: getEmoji(client, clientRanking.user.username),
                value: clientRanking.user.id,
            })

        musicBots.forEach(bot => {
            select.addOptions({
                label: bot.client.user.username,
                emoji: getEmoji(client, bot.client.user.username),
                value: bot.client.user.id,
            })
        })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};