const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { moveElementInArray } = require("../../functions/music/moveElementInArray");

module.exports = {
    name: "loop",
    description: "Impostare una modalità di ripetizione della coda",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/loop [mode]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "mode",
                description: "Modalità di ripetizione",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "↪️ Off",
                        value: "0"
                    },
                    {
                        name: "🔂 Song",
                        value: "1"
                    },
                    {
                        name: "🔁 Queue",
                        value: "2"
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, musicClient) {
        let mode = parseInt(interaction.options.getString("mode"))

        if (distube.getQueue(interaction.guild.id)?.repeatMode == mode) {
            if (mode == 0) return replyMessage(client, interaction, "Warning", "Ripetizione già disattivata", "La modalità di riproduzione è già disattivata", comando)
            if (mode == 1) return replyMessage(client, interaction, "Warning", "Ripetizione brano già attiva", "La modalità di riproduzione di un singolo brano è già attiva", comando)
            if (mode == 2) return replyMessage(client, interaction, "Warning", "Ripetizione coda già attiva", "La modalità di riproduzione dell'intera coda è già attiva", comando)
        }

        try {
            distube.setRepeatMode(interaction.guild.id, mode)
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia in coda", comando)
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(mode == 0 ? "Loop disabled" : mode == 1 ? "Loop on song" : "Loop on queue")
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(`${mode == 0 ? ":arrow_right_hook: La modalità di ripetizione è stata disattivata" : mode == 1 ? ":repeat_one: Impostata la modalità di ripetizione su un singolo brano" : ":repeat: Impostata la modalità di ripetizione sull'intera coda di riproduzione"}`)

        interaction.reply({ embeds: [embed] })
    },
};