const Discord = require("discord.js");
const colors = require("../../config/general/colors.json");
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { getEmoji } = require("../../functions/general/getEmoji");
const { musicBots } = require("../../index");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("songSearch")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Menu non tuo", "Questo menu è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ricerca brano`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Caricamento brano...`)

        interaction.message.edit({ embeds: [embed], components: [] })

        let channel = interaction.message.channel
        channel.msg = interaction.message

        let distube = musicBots.find(x => x.client.user.id == interaction.customId.split(",")[2]).distube
        let musicClient = musicBots.find(x => x.client.user.id == interaction.customId.split(",")[2]).client

        distube.play(musicClient.channels.cache.get(interaction.member.voice.channel.id), interaction.values[0], {
            member: musicClient.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id),
            textChannel: channel,
            metadata: interaction,
        })
    },
};