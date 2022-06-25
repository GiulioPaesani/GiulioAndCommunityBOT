const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("accettaInvito")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Invito non per te", "Questo invito non si riferisce a te, non puoi accettarlo")

        let serverstats = await getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[2])
        if (!room) return

        const hasPermissionInChannel = client.channels.cache.get(room.channel)
            .permissionsFor(interaction.user)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Sei già dentro", "Hai già accesso a questa stanza")
        }

        client.channels.cache.get(room.channel).permissionOverwrites.edit(interaction.user, {
            VIEW_CHANNEL: true
        })

        let embed = new Discord.MessageEmbed()
            .setTitle("Invito accettato")
            .setColor(colors.green)
            .setDescription(`L'invito è stato accettato, ora hai accesso alla stanza <#${room.channel}>`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};