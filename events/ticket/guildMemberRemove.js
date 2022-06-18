const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { getServer } = require("../../functions/database/getServer")

module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
        if (isMaintenance(member.user.id)) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        let serverstats = getServer()
        if (!serverstats.tickets.find(x => x.owner == member.user.id)) return

        let ticket = serverstats.tickets.find(x => x.owner == member.user.id)

        let embed = new Discord.MessageEmbed()
            .setTitle(":outbox_tray: Owner uscito :outbox_tray:")
            .setColor(colors.purple)
            .setDescription(`L'owner <#${ticket.owner}> è uscito dal server, potete chiudere il ticket con \`/tclose\``)

        client.channels.cache.get(ticket.channel).send({ embeds: [embed] })
    }
}