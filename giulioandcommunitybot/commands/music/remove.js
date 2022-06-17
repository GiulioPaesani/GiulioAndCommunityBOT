const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "remove",
    description: "Rimuovere una traccia dalla coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/remove [position]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "position",
                description: "Posizione della traccia da rimuovere dalla coda",
                type: "INTEGER",
                minValue: 2,
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)
        if (!queue) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da rimuovere", comando)
        }

        if (!queue.songs[interaction.options.getInteger("position") - 1]) return replyMessage(client, interaction, "Error", "Posizione non valida", "Inserisci una posizione corrispondente a una traccia in coda", comando)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Song removed`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:outbox_tray: ${queue.songs[interaction.options.getInteger("position") - 1].name} rimosso dalla coda`)

        interaction.reply({ embeds: [embed] })

        distube.getQueue(interaction.guild.id).songs = distube.getQueue(interaction.guild.id).songs.filter(x => x != queue.songs[interaction.options.getInteger("position") - 1])
    },
};