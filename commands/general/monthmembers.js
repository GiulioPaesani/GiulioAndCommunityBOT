const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { getServer } = require("../../functions/database/getServer")

module.exports = {
    name: "monthmembers",
    description: "Visualizzare il membro del mese attuale e quelli precedenti",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/monthmembers",
    category: "general",
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = await getServer()

        const monthmembers = serverstats.monthmembers

        let currentMonth = moment().format("YYMM")
        let currentMember = monthmembers.find(x => x.month == currentMonth)?.user || "_Membro non ancora scelto_"

        let lastMonths = ""
        monthmembers.sort((a, b) => b.month - a.month).filter(x => x.month < currentMonth).slice(0, 10).forEach(member => {
            lastMonths += `${moment(member.month, "YYMM").format("MMMM YYYY")} - <@${member.user}>\n`
        })


        let embed = new Discord.MessageEmbed()
            .setTitle(":sparkling_heart: Member of the month :sparkling_heart:")
            .setColor(colors.purple)
            .setDescription(`Il **membro del mese** è un utente del server che viene eletto **mensilmente** dallo staff`)
            .addField(":bust_in_silhouette: This month", `
**${moment().format("MMMM YYYY").toUpperCase()}** - ${currentMember != "_Membro non ancora scelto_" ? `<@${currentMember}>` : currentMember}`)

        if (lastMonths) {
            embed.addField(":busts_in_silhouette: Last months", lastMonths)
        }

        embed.addField(":beginner: Privilegi", `
- **Ruolo** esclusivo <@&${settings.idRuoloMonthMember}>
- Chat <#${settings.idCanaliServer.bar}> con lo **staff**
- Poter usare i comandi **ovunque**
`)
        if (currentMember != "_Membro non ancora scelto_")
            embed.setThumbnail(client.guilds.cache.get(settings.idServer).members.cache.get(currentMember)?.displayAvatarURL({ dynamic: true }))


        interaction.reply({ embeds: [embed] })
    },
};