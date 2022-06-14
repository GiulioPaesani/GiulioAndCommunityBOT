const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaReport")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug reportato :beetle:")
            .setColor(colors.green)
            .setDescription(`**Grazie** per aver segnalato questo problema. È già stato **consegnato** allo staff che cercherà di **risolverlo** il prima possibile`)
            .addField(":page_facing_up: Report", interaction.message.embeds[0].fields[0].value)

        interaction.message.edit({ embeds: [embed], components: [] })

        embed = new Discord.MessageEmbed()
            .setTitle(":beetle: Bug report :beetle:")
            .setColor(colors.yellow)
            .setDescription(`[Message link](https://discord.com/channels/${interaction.message.guild.id}/${interaction.message.channel.id}/${interaction.message.id})`)
            .addField(":alarm_clock: Time", moment().format("ddd DD MMM YYYY, HH:mm:ss"), true)
            .addField(":bust_in_silhouette: User", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[0].value)

        client.channels.cache.get(log.general.bugReport).send({ embeds: [embed] });
    },
};
