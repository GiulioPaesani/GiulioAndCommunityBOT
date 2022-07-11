const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getServer } = require("../../../functions/database/getServer")

module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
        const maintenanceStates = await isMaintenance(member.user.id)
        if (maintenanceStates) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        let serverstats = await getServer()
        if (!serverstats.rooms.find(x => x.owner.includes(member.user.id))) return

        let room = serverstats.rooms.find(x => x.owner.includes(member.user.id))

        let embed = new Discord.MessageEmbed()
            .setTitle(":outbox_tray: Owner uscito :outbox_tray:")
            .setColor(colors.purple)
            .setDescription(`L'owner <@${member.user.id}> di questa stanza privata è uscito dal server`)

        client.channels.cache.get(room.channel).send({ embeds: [embed] })
    }
}