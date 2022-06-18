const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("rifiutaInvito")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Invito non per te", "Questo invito non si riferisce a te, non puoi rifiutarlo")

        let serverstats = getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[2])
        if (!room) return

        const hasPermissionInChannel = client.channels.cache.get(room.channel)
            .permissionsFor(interaction.user)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Sei già dentro", "Hai già accesso a questa stanza, non puoi rifiutare l'invito")
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Invito rifiutato")
            .setColor(colors.red)
            .setDescription(`L'invito alla stanza #${client.channels.cache.get(room.channel).name} è stato rifiutato`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};