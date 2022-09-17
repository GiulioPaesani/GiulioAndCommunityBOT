const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const { addUser } = require("../../../functions/database/addUser")
const { getUser } = require("../../../functions/database/getUser")
const { updateUser } = require("../../../functions/database/updateUser")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("accettaThank")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Ringrazimento non per te", "Questo ringraziamento non è destinato a te")

        let embed = new Discord.MessageEmbed()
            .setTitle(":heartpulse: Ringraziamento accettato :heartpulse: ")
            .setColor(colors.pink)
            .setDescription(`Il **grazie** di <@${interaction.customId.split(",")[2]}> è stato **inviato** con successo a <@${interaction.customId.split(",")[1]}>
            
Guarda i tuoi **grazie totali** in </thanks:1018431333808226366> e se sei in **classifica** riceverai tanti **premi** ogni settimana`)

        interaction.message.edit({ embeds: [embed], components: [] })

        let userstats = await getUser(interaction.customId.split(",")[1])
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(interaction.customId.split(",")[1]) || client.users.cache.get(interaction.customId.split(",")[1]))

        userstats.thanks = (userstats.thanks || 0) + 1;
        userstats.totalThanks = (userstats.totalThanks || 0) + 1;

        updateUser(userstats)
    },
};
