const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg");

module.exports = {
    name: "previous",
    description: "Ritornare alla traccia precedente in riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/previous",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        try {
            distube.previous(client.channels.cache.get(interaction.member.voice.channel.id))
                .catch((error) => {
                    if (error.code == "NO_PREVIOUS") {
                        return replyMessage(client, interaction, "Warning", "Nessuna traccia precedente", "Non c'è nessuna traccia precedente a quella attuale")
                    }
                })
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia in riproduzione")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Previous song`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:track_previous: Traccia precedente in riproduzione`)

        interaction.reply({ embeds: [embed] })

        updateNowPlayingMsg(musicClient, distube.getQueue(interaction.guild.id).textChannel)
    },
};