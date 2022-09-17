const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("annullaCancellazioneIscrizione")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[1])
        if (!event) return

        let embed = new Discord.MessageEmbed()
            .setTitle("Cancellazione iscrizione annullata")
            .setDescription("Questa iscrizione non si cancellerà più")

        interaction.message.edit({ embeds: [embed], components: [] })

        if (!event.partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)]?.daEliminare) return

        serverstats.events[serverstats.events.findIndex(x => x.message == interaction.customId.split(",")[1])].partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)].daEliminare = false;

        updateServer(serverstats)

        client.channels.cache.get(interaction.channelId).messages.fetch(event.partecipanti[event.partecipanti.findIndex(x => x.channel == interaction.channelId)].message)
            .then(async msg => {
                let button1 = new Discord.MessageButton()
                    .setLabel("Cancella iscrizione")
                    .setStyle("DANGER")
                    .setCustomId(`cancellaIscrizione,${event.message}`)

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                msg.edit({ embeds: msg.embeds, components: [row] })
            })
    },
};