const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("sub")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate().catch(() => { })

        const type = interaction.customId.split(",")[1]

        if (type == "video") {
            if (!interaction.member.roles.cache.has(settings.idRuoloGiulioSubPro) && getUserPermissionLevel(client, interaction.user.id) <= 2) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setColor(colors.purple)
                    .setDescription(`Per visualizzare questo contenuto è necessario essere **abbonati** come <@&${settings.idRuoloGiulioSubPro}>`)

                return interaction.followUp({ embeds: [embed], ephemeral: true })
            }

            const msg = await client.channels.cache.get(log.general.subscontent).messages.fetch(interaction.customId.split(",")[2])

            let embed = new Discord.MessageEmbed()
                .setTitle(msg.embeds[0].fields[0].value)
                .setColor("#16A0F4")
                .setThumbnail(msg.embeds[0].fields[2].value)
                .setDescription(`:gem: Hai accesso a questo video prima di tutti gli altri`)

            let button1 = new Discord.MessageButton()
                .setURL(msg.embeds[0].fields[1].value)
                .setStyle("LINK")
                .setLabel("Vai al video")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })
        }
        else if (type == "world") {
            if (!interaction.member.roles.cache.has(settings.idRuoloGiulioSubTwitch) && getUserPermissionLevel(client, interaction.user.id) <= 2) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setColor(colors.purple)
                    .setDescription(`Per visualizzare questo contenuto è necessario essere **abbonati** come <@&${settings.idRuoloGiulioSubPro}>`)

                return interaction.followUp({ embeds: [embed], ephemeral: true })
            }

            const msg = await client.channels.cache.get(log.general.subscontent).messages.fetch(interaction.customId.split(",")[2])

            let embed = new Discord.MessageEmbed()
                .setTitle("Scarica il mondo")
                .setColor("#50A75B")
                .setDescription(`:gem: Hai accesso in eslusiva al download di questo mondo sempre aggiornato`)

            let button1 = new Discord.MessageButton()
                .setURL(msg.embeds[0].fields[0].value)
                .setStyle("LINK")
                .setLabel("Scarica il mondo")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })
        }
        else if (type == "code") {
            if (!interaction.member.roles.cache.has(settings.idRuoloGiulioSubTwitch) && getUserPermissionLevel(client, interaction.user.id) <= 2) {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Non hai il permesso")
                    .setColor(colors.purple)
                    .setDescription(`Per visualizzare questo contenuto è necessario essere **abbonati** come <@&${settings.idRuoloGiulioSubPro}>`)

                return interaction.followUp({ embeds: [embed], ephemeral: true })
            }

            const msg = await client.channels.cache.get(log.general.subscontent).messages.fetch(interaction.customId.split(",")[2])

            let embed = new Discord.MessageEmbed()
                .setTitle("Scarica il codice")
                .setColor("#506EA7")
                .setDescription(`:gem: Hai accesso in eslusiva al download del source in anteprima`)

            let button1 = new Discord.MessageButton()
                .setURL(msg.embeds[0].fields[0].value)
                .setStyle("LINK")
                .setLabel("Scarica il codice")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })
        }
    },
};