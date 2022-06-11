const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "autoplay",
    description: "Attivare/Disattivare la riproduzione automatica dopo la fine della coda",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/autoplay [on/off]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "mode",
                description: "Stato della riproduzione automatica",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "🟢ON",
                        value: "on"
                    },
                    {
                        name: "🔴 OFF",
                        value: "off"
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let mode = interaction.options.getString("mode") == "on" ? true : false

        if (distube.getQueue(interaction.guild.id)?.autoplay == mode) {
            if (mode) return replyMessage(client, interaction, "Warning", "Riproduzione automatica già attiva", "La riproduzione automatica è già attiva", comando)
            if (!mode) return replyMessage(client, interaction, "Warning", "Ripetizione automatica già disattivata", "La riproduzione automatica già disattivata", comando)
        }

        try {
            distube.toggleAutoplay(interaction.guild.id)
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia in coda", comando)
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(mode ? "Autoplay enabled" : "Autoplay disabled")
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(mode ? ":crystal_ball: La riproduzione automatica è stata attivata" : ":crystal_ball: La riproduzione automatica è stata disattivata")

        interaction.reply({ embeds: [embed] })
    },
};