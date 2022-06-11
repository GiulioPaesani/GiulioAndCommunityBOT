const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg");

module.exports = {
    name: "stop",
    description: "Fermare completamnete la riproduzione musicale",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/stop",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        try {
            distube.stop(client.channels.cache.get(interaction.member.voice.channel.id))
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da stoppare")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue stopped`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:stop_button: Riproduzione stoppata`)

        interaction.reply({ embeds: [embed] })

        updateNowPlayingMsg(musicClient, distube.getQueue(interaction.guild.id).textChannel)
    },
};