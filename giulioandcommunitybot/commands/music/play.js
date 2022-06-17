const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { getEmoji } = require("../../functions/general/getEmoji");

module.exports = {
    name: "play",
    description: "Riprodurre una traccia",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/play [query] (position)",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "query",
                description: "URL o ricerca della traccia da riprodurre",
                type: "STRING",
                required: true
            },
            {
                name: "position",
                description: "Posizione in cui inserire la traccia nella coda",
                type: "INTEGER",
                minValue: 2,
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        let query = interaction.options.getString("query")
        let position = interaction.options.getInteger("position")

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ricerca brani...`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Ricerca brani per \`${query}\``)

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        let channel = musicClient.channels.cache.get(interaction.channelId)
        channel.msg = msg

        distube.play(musicClient.channels.cache.get(interaction.member.voice.channel.id), query, {
            member: musicClient.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.user.id),
            textChannel: channel,
            metadata: interaction,
            position: position - 1
        }).catch(() => {
            let embed = new Discord.MessageEmbed()
                .setTitle("C'è stato un errore")
                .setColor(colors.red)
                .setDescription(`Non sono riuscito a riprodurre la canzone inserita`)

            msg.edit({ embeds: [embed] })
        })
    },
};