const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg");

module.exports = {
    name: "jump",
    description: "Saltare direttamente a una traccia in coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/jump [position]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "position",
                description: "Posizione a cui si vuole saltare nella coda",
                type: "INTEGER",
                minValue: 2,
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        try {
            distube.jump(client.channels.cache.get(interaction.member.voice.channel.id), interaction.options.getInteger("position") - 1)
                .catch(() => { })
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da saltare in coda", comando)
            }
        }

        let queue = distube.getQueue(interaction.guild.id)
        if (!queue.songs[interaction.options.getInteger("position") - 1]) return replyMessage(client, interaction, "Error", "Posizione non valida", "Inserisci una posizione corrispondente a una traccia in coda", comando)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Jumped`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:arrow_right: Coda saltata alla traccia ${interaction.options.getInteger("position")}`)

        interaction.reply({ embeds: [embed] })

        updateNowPlayingMsg(musicClient, distube.getQueue(interaction.guild.id).textChannel)
    },
};