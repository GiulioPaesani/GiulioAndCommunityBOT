const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg");

module.exports = {
    name: "skip",
    description: "Saltare la traccua attualmente in riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/skip",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        try {
            distube.skip(client.channels.cache.get(interaction.member.voice.channel.id))
                .catch((error) => {
                    if (error.code == "NO_UP_NEXT") {
                        distube.stop(interaction.guild.id)
                    }
                })
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da saltare")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Song skipped`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:track_next: Traccia attuale saltata`)

        interaction.reply({ embeds: [embed] })

        updateNowPlayingMsg(musicClient, distube.getQueue(interaction.guild.id).textChannel)
    },
};