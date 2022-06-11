const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");

module.exports = {
    name: "effect",
    description: "Imposta un effetto nella riproduzione della coda",
    permissionLevel: 0,
    requiredLevel: 40,
    syntax: "/effect [type/off]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "type",
                description: "Tipo di effetto da applicare",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "🔴 OFF",
                        value: "off"
                    },
                    {
                        name: "3d",
                        value: "3d"
                    },
                    {
                        name: "bassboost",
                        value: "bassboost"
                    },
                    {
                        name: "echo",
                        value: "echo"
                    },
                    {
                        name: "karaoke",
                        value: "karaoke"
                    },
                    {
                        name: "nightcore",
                        value: "nightcore"
                    },
                    {
                        name: "vaporwave",
                        value: "vaporwave"
                    },
                    {
                        name: "flanger",
                        value: "flanger"
                    },
                    {
                        name: "gate",
                        value: "gate"
                    },
                    {
                        name: "haas",
                        value: "haas"
                    },
                    {
                        name: "reverse",
                        value: "reverse"
                    },
                    {
                        name: "surround",
                        value: "surround"
                    },
                    {
                        name: "mcompand",
                        value: "mcompand"
                    },
                    {
                        name: "phaser",
                        value: "phaser"
                    },
                    {
                        name: "tremolo",
                        value: "tremolo"
                    },
                    {
                        name: "earwax",
                        value: "earwax"
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let effect = interaction.options.getString("effect")

        if (effect != "off" && distube.getQueue(interaction.guild.id)?.filters.includes(effect)) {
            return replyMessage(client, interaction, "Warning", "Effetto già attivo", `L'effetto ${effect} è già attivo nella riproduzione`, comando)
        }
        if (effect == "off" && distube.getQueue(interaction.guild.id)?.filters.length == 0) {
            return replyMessage(client, interaction, "Warning", "Effetto già disabilitato", `Non è già presente nessun effetto nella riproduzione`, comando)
        }

        try {
            distube.setFilter(interaction.guild.id)

            if (effect != "off")
                distube.setFilter(interaction.guild.id, effect)
        }
        catch (error) {
            if (error.errorCode == "NO_QUEUE") {
                return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia su cui applicare l'effetto", comando)
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(effect == "off" ? "Effect removed" : `Effect applied`)
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setDescription(effect == "off" ? `:alien: Effetto rimosso` : `:alien: Effetto ${effect} applicato`)

        interaction.reply({ embeds: [embed] })
    },
};