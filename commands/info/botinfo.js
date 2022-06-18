const Discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
const fetch = require("node-fetch")
const settings = require("../../config/general/settings.json")
const changelogs = require("../../config/general/changelogs.json")
const { description } = require("../../package.json")
const { getServer } = require("../../functions/database/getServer")

module.exports = {
    name: "botinfo",
    description: "Visualizzare informazioni sul bot",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/botinfo",
    category: "info",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let serverstats = getServer()
        const maintenanceStates = process.env.isHost == "false" ? serverstats.maintenance.local : serverstats.maintenance.host

        let embed = new Discord.MessageEmbed()
            .setTitle(client.user.tag)
            .setThumbnail(client.user.avatarURL({ size: 1024 }))
            .setDescription(description)
            .addField(":turtle: Ping", `${client.ws.ping}ms`, true)
            .addField(":floppy_disk: Ram", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
            .addField(":stopwatch: Uptime", `${ms(client.uptime, { long: true })} - ${moment(new Date().getTime() - client.uptime).format("ddd DD MMM, HH:mm:ss")}`, true)
            .addField(":pencil: Created at", `${moment(client.user.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(client.user.createdAt).fromNow()})`, true)
            .addField(":bar_chart: Tot commands", client.commands.size.toString(), true)
            .addField(":clipboard: Version", `${changelogs.sort((a, b) => moment(a.date) > moment(b.date) ? 1 : -1)[changelogs.length - 1].version}\n([Last changelog](https://youtu.be/${changelogs.sort((a, b) => moment(a.date) > moment(b.date) ? 1 : -1)[changelogs.length - 1].idVideo}))`, true)
            .addField(":construction: Maintenance", maintenanceStates == 0 ? `Off - Everyone can use bot` : maintenanceStates == 1 ? `Mode 1 - Only tester can use bot` : maintenanceStates == 2 ? `Mode 2 - Nobody can use bot` : maintenanceStates == 3 ? `Mode 3 - Everyone, except testers, can use bot` : "", true)

        interaction.reply({ embeds: [embed] })
    },
};