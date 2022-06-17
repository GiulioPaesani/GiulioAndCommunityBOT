const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "clearqueue",
    description: "Cancellare tutta la coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/clearqueue",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)
        if (!queue) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia in riproduzione")
        }
        if (!queue.songs[1]) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in coda", "Non c'è nessuna traccia in coda dopo quella attuale")
        }

        distube.getQueue(interaction.guild.id).songs = [distube.getQueue(interaction.guild.id).songs[0]]

        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue cleared`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:asterisk: Coda di riproduzione cancellata`)

        interaction.reply({ embeds: [embed] })
    },
};