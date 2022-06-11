const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { updateNowPlayingMsg } = require("../../functions/music/updateNowPlayingMsg");

module.exports = {
    name: "leave",
    description: "Disconnettere il bot musicale dalla chat vocale",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/leave",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let utente = interaction.guild.members.cache.get(musicClient.user.id)

        if (!utente.voice?.channel) {
            return replyMessage(client, interaction, "Warning", "Nessun bot in chat vocale", "Non c'è nessun bot da disconnettere")
        }

        utente.voice.disconnect()

        updateNowPlayingMsg(client, client.channels.cache.get(interaction.channelId))

        let embed = new Discord.MessageEmbed()
            .setTitle(`Bot disconnected`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:eject: Bot disconnesso dalla chat vocale`)

        interaction.reply({ embeds: [embed] })
    },
};