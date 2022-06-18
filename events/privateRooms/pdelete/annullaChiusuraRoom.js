const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("annullaChiusuraRoom")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        let serverstats = getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[1])
        if (!room) return

        if (!room.owners.includes(interaction.user.id) && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi annullare la chiusura di questa stanza")
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Chiusura stanza annullata")
            .setDescription("Questa stanza non si chiuderà più")

        interaction.message.edit({ embeds: [embed], components: [] })

        if (!room.daEliminare) return

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == interaction.customId.split(",")[1])].daEliminare = false;
        updateServer(serverstats)
    },
};