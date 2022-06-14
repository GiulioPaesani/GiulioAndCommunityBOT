const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const log = require("../../config/general/log.json")
const colors = require("../../config/general/colors.json")
const { replyMessage } = require("../../functions/general/replyMessage.js")
const { isMaintenance } = require("../../functions/general/isMaintenance")

module.exports = {
    name: "nickname",
    description: "Imposta il tuo nickname nel server",
    permissionLevel: 0,
    requiredLevel: 15,
    syntax: "/nickname [set/reset] [nickname]",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "set",
                description: "Setta il tuo nickname",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "nickname",
                        description: "Nickname che vuoi settare",
                        type: "STRING",
                        required: true,
                    },
                ]
            },
            {
                name: "reset",
                description: "Resetta il tuo nickname",
                type: "SUB_COMMAND",
            },
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        if (!interaction.member.manageable) {
            return replyMessage(client, interaction, "NonHoPermesso", "", "Non ho il permesso di settarti il nickname", comando)
        }

        if (interaction.options.getSubcommand() == "set") {
            let nickname = interaction.options.getString("nickname")

            if (nickname.length > 32) {
                return replyMessage(client, interaction, "Warning", "Nickname troppo lungo", "Puoi scrivere un nickname solo fino a 32 caratteri", comando)
            }

            if (nickname == interaction.member.nickname) {
                return replyMessage(client, interaction, "Warning", "Nickname già inserito", "Hai già questo nickname", comando)
            }

            if (!interaction.member.nickname && nickname == interaction.member.user.username) {
                return replyMessage(client, interaction, "Warning", "Nickname già inserito", "Hai già questo nickname come username", comando)
            }

            if (interaction.guild.members.cache.find(x => x.user.id != interaction.user.id && (x.user.username == nickname || (x.nickname && x.nickname == nickname)))) {
                let button1 = new Discord.MessageButton()
                    .setLabel("Setta comunque")
                    .setCustomId(`settaNick,${interaction.user.id},${nickname}`)
                    .setStyle("SUCCESS")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                return replyMessage(client, interaction, "Warning", "Nickname già presente", "Un altro utente nel server a questo stesso nickname, vuoi settarlo comunque?", comando, null, [row])
            }

            await interaction.member.setNickname(nickname)

            replyMessage(client, interaction, "Correct", "Nickname settato", `Hai settato il tuo nickname in **${interaction.member.nickname || interaction.member.user.username}**`, comando)
        }
        else if (interaction.options.getSubcommand() == "reset") {
            if (!interaction.member.nickname) {
                return replyMessage(client, interaction, "Warning", "Nickname non settato", "Non hai un nickname settato, non è necessario resettarlo", comando)
            }

            interaction.member.setNickname(null)

            replyMessage(client, interaction, "Correct", "Nickname resettato", `Hai resettato il tuo nickname in **${interaction.user.username}**`, comando)
        }
    },
};