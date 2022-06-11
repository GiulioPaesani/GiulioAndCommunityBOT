const Discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const changelogs = require("../../config/general/changelogs.json")
const { version } = require("../../package.json")
const { getServer } = require("../../functions/database/getServer")
const { musicBots, clientModeration, clientFun, clientRanking } = require("../../index");
const { getEmoji } = require("../../functions/general/getEmoji")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("botinfoMenu")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let clients = [client, clientFun, clientModeration, clientRanking, ...musicBots.map(x => x.client)]
        let botinfoClient = clients.find(x => x.user.id == interaction.values[0])

        let serverstats = getServer()
        const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance.local : serverstats.maintenance.host

        let embed = new Discord.MessageEmbed()
            .setTitle(botinfoClient.user.tag)
            .setThumbnail(botinfoClient.user.avatarURL({ size: 1024 }))
            .setDescription("Informazione su questo bot all'interno del server")
            .addField(":turtle: Ping", `${botinfoClient.ws.ping}ms`, true)
            .addField(":floppy_disk: Ram", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField(":stopwatch: Uptime", `${ms(botinfoClient.uptime, { long: true })} - ${moment(new Date().getTime() - botinfoClient.uptime).format("ddd DD MMM, HH:mm:ss")}`, true)
            .addField(":pencil: Created at", `${moment(botinfoClient.user.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(botinfoClient.user.createdAt).fromNow()})`, true)
            .addField(":bar_chart: Info", `Tot commands: ${botinfoClient.commands?.size || 0}\nTot events: ${botinfoClient.events}\n`, true)
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

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};