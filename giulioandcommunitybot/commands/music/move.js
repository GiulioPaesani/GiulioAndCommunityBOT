const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { moveElementInArray } = require("../../functions/music/moveElementInArray");

module.exports = {
    name: "move",
    description: "Spostare una traccia in coda in un'altra posizione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/move [from] [to]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "from",
                description: "Posizione della traccia da spostare",
                type: "INTEGER",
                minValue: 2,
                required: true
            },
            {
                name: "to",
                description: "Posizione di destinazione dove spostare la traccia",
                type: "INTEGER",
                minValue: 2,
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)
        let from = interaction.options.getInteger("from")
        let to = interaction.options.getInteger("to")

        if (!queue) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da spostare", comando)
        }

        if (!queue.songs[from - 1]) return replyMessage(client, interaction, "Error", "Posizione non valida", "Inserisci una posizione corrispondente alla traccia che vuoi spostare", comando)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Song moved`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:arrows_clockwise: ${queue.songs[from - 1].name} spostata dalla posizione ${from} alla posizione ${to}`)

        interaction.reply({ embeds: [embed] })

        distube.getQueue(interaction.guild.id).songs = moveElementInArray(queue.songs, from - 1, to - 1)
    },
};