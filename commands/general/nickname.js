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

            if (!interaction.member.nickname) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Nickname setted :inbox_tray:")
                    .setColor(colors.green)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`, false)
                    .addField(":placard: Nickname", `Old: _Null_\nNew: ${nickname}`)

                // if (!isMaintenance())
                //     client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })
            }
            else {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":pencil: Nickname updated :pencil:")
                    .setColor(colors.yellow)
                    .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`, false)
                    .addField(":placard: Nickname", `Old: ${interaction.member.nickname}\nNew: ${nickname}`)

                // if (!isMaintenance())
                //     client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })
            }

            await interaction.member.setNickname(nickname)

            replyMessage(client, interaction, "Correct", "Nickname settato", `Hai settato il tuo nickname in **${interaction.member.nickname || interaction.member.user.username}**`, comando)
        }
        else if (interaction.options.getSubcommand() == "reset") {
            if (!interaction.member.nickname) {
                return replyMessage(client, interaction, "Warning", "Nickname non settato", "Non hai un nickname settato, non è necessario resettarlo", comando)
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Nickname removed :outbox_tray:")
                .setColor(colors.red)
                .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`, false)
                .addField(":placard: Nickname", `Old: ${interaction.member.nickname}\nNew: _Null_`)

            // if (!isMaintenance())
            //     client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            interaction.member.setNickname(null)

            replyMessage(client, interaction, "Correct", "Nickname resettato", `Hai resettato il tuo nickname in **${interaction.user.username}**`, comando)
        }
    },
};