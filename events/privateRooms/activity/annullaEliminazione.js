const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("annullaEliminazione")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        let serverstats = await getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[1])
        if (!room) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Stanza eliminata")
                .setColor(colors.gray)
                .setDescription(`Questa stanza è stata eliminata`)

            interaction.message.edit({ embeds: [embed], components: [] })
        }

        if (!room.owners.includes(interaction.user.id) && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi annullare l'eliminazione di questa stanza")
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Inattività cancellata")
            .setColor(colors.green)
            .setDescription(`L'inattività ${room.type == "text" ? `di questa stanza` : `della stanza <#${room.channel}>`} è stata cancellata, non verrà più eliminata\nSe invece non la utilizzate più, usa il comando \`/pdelete\` per eliminarla`)

        interaction.message.edit({ embeds: [embed], components: [] })

        room.lastActivityCount = 0
        room.lastActivity = new Date().getTime()

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
        updateServer(serverstats)
    },
};