const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "pause",
    description: "Mettere in pausa la riproduzione musicale",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/pause",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        try {
            distube.pause(client.channels.cache.get(interaction.member.voice.channel.id))
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da mettere in pausa")
            }
            if (error.errorCode == "PAUSED") {
                return replyMessage(client, interaction, "Warning", "Riproduzione già in pausa", "La riproduzione musicale è già in pausa")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue paused`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:pause_button: Riproduzione messa in pausa`)

        interaction.reply({ embeds: [embed] })
    },
};