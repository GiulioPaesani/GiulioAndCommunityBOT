const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("entraInvito")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        let serverstats = await getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[1])
        if (!room) return

        const hasPermissionInChannel = client.channels.cache.get(room.channel)
            .permissionsFor(interaction.member)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Sei già dentro", "Hai già accesso a questa stanza")
        }

        client.channels.cache.get(room.channel).permissionOverwrites.edit(interaction.member, {
            VIEW_CHANNEL: true
        })

        replyMessage(client, interaction, "Correct", "Benvenuto nella stanza", `Ora hai accesso alla stanza <#${room.channel}>`)
    },
};