const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: "messageCreate",
    client: "general",
    async execute(client, message) {
        if (message.author.bot) return

        if (isMaintenance(message.author.id)) return

        let serverstats = getServer()
        let room = serverstats.privateRooms.find(x => x.channel == message.channel.id)
        if (!room) return

        if (!room.owners.includes(message.author.id)) return

        room.lastActivityCount = 0
        room.lastActivity = new Date().getTime()

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
        updateServer(serverstats)

        client.channels.cache.get(room.channel).messages.fetch()
            .then(messages => {
                for (let msg of Array.from(messages.values())) {
                    if (msg.embeds[0]?.title == "Stanza un po' inattiva" || msg.embeds[0]?.title == "Stanza troppo inattiva") {
                        let embed = new Discord.MessageEmbed()
                            .setTitle("Inattività cancellata")
                            .setColor(colors.green)
                            .setDescription(`L'inattività ${room.type == "text" ? `di questa stanza` : `della stanza <#${room.channel}>`} è stata cancellata, non verrà più eliminata\nSe invece non la utilizzate più, usa il comando \`/pdelete\` per eliminarla`)

                        msg.edit({ embeds: [embed], components: [] })
                    }
                }
            })
    }
}