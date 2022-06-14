const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("annullaInvito")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate()
            .catch(() => { })

        let serverstats = getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[2])
        if (!room) return

        if (!room.owners.includes(interaction.user.id) && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi annullare l'invito di questa stanza")
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Invito annullato")
            .setColor(colors.gray)
            .setDescription(`L'invito alla stanza <#${room.channel}> è stato annullato, contatta l'**owner** se vuoi entrare

:postal_horn: **Di cosa si tratta?**${interaction.message.embeds[0].description.split(":postal_horn: **Di cosa si tratta?**")[1]}`)

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};