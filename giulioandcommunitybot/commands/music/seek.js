const Discord = require("discord.js");
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const sd = require('simple-duration-converter');
const human2sec = require('human2sec');
const { humanizeTime } = require("../../functions/general/humanizeTime")

module.exports = {
    name: "seek",
    description: "Spostarsi in un punto specifico di un brano",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/seek [time]",
    client: "general",
    category: "music",
    musicMode: true,
    data: {
        options: [
            {
                name: "time",
                description: "Punto del brano a cui spostarsi",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        let time
        try {
            time = sd.parse(interaction.options.getString("time"))
        }
        catch {

        }
        if (!time) time = human2sec("0" + interaction.options.getString("time"))
        if (!time) time = parseInt(interaction.options.getString("time"))

        if ((!time && time != 0) || time < 0) {
            return replyMessage(client, interaction, "Error", "Tempo non valido", "Hai inserito un tempo non corrispondente a un punto del brano attuale", comando)
        }

        let queue = distube.getQueue(interaction.guild.id)

        if (queue?.songs[0].isLive) {
            return replyMessage(client, interaction, "Warning", "Non disponibile su una live", "Non è possibile spostare la riproduzione in una diretta live", comando)
        }

        if (queue?.songs[0].duration < time) {
            return replyMessage(client, interaction, "Error", "Tempo non valido", "Hai inserito un tempo non corrispondente a un punto del brano attuale", comando)
        }

        try {
            distube.seek(client.channels.cache.get(interaction.member.voice.channel.id), time)
            if (queue.paused) distube.resume(client.channels.cache.get(interaction.member.voice.channel.id))
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da stoppare")
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Song position setted`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`:arrow_heading_down: Riproduzione del brano spostato a ${humanizeTime(time)}`)

        interaction.reply({ embeds: [embed] })
    },
};