const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "restart",
    description: "Far ripartire il brano attuale dall'inizio",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/stop",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        try {
            distube.seek(client.channels.cache.get(interaction.member.voice.channel.id), 0)
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da stoppare")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Song restarted`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:arrows_counterclockwise: Il brano è stato fatto ripartire dall'inizio`)

        interaction.reply({ embeds: [embed] })
    },
};