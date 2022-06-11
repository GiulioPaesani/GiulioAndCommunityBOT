const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { moveElementInArray } = require("../../functions/music/moveElementInArray");

module.exports = {
    name: "shuffle",
    description: "Riprodurre in modo casuale l'attuale coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/shuffle",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)
        if (!queue) return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia in coda")

        distube.shuffle(client.channels.cache.get(interaction.member.voice.channel.id))

        let embed = new Discord.MessageEmbed()
            .setTitle(`Queue shuffled`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:twisted_rightwards_arrows: La coda di riproduzione è stata mescolata`)

        interaction.reply({ embeds: [embed] })
    },
};