const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "resume",
    description: "Riprendere la riproduzione musicale",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/resume",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        try {
            distube.resume(client.channels.cache.get(interaction.member.voice.channel.id))
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da riprendere")
            }
            if (error.errorCode == "RESUMED") {
                return replyMessage(client, interaction, "Warning", "Riproduzione già ripresa", "La riproduzione musicale è già avviata")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue resumed`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:arrow_forward: Riproduzione ripresa`)

        interaction.reply({ embeds: [embed] })
    },
};