const Discord = require('discord.js');
const moment = require("moment");
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const log = require("../../config/general/log.json");
const { addUser } = require("../../functions/database/addUser");
const { getUser } = require("../../functions/database/getUser");
const { getUserPermissionLevel } = require('../../functions/general/getUserPermissionLevel');
const { replyMessage } = require("../../functions/general/replyMessage");
const { hasSufficientLevels } = require('../../functions/leveling/hasSufficientLevels');
const { isMaintenance } = require('../../functions/general/isMaintenance');

module.exports = {
    name: "say",
    description: "Far scrivere al bot un qualsiasi messaggio personalizzato",
    permissionLevel: 0,
    requiredLevel: 15,
    cooldown: 10,
    syntax: "/say [text]",
    category: "fun",
    data: {
        options: [
            {
                name: "text",
                description: "Messaggio da far scrivere al bot",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        if (!hasSufficientLevels(client, userstats, 60) && interaction.channelId != settings.idCanaliServer.commands && !getUserPermissionLevel(client, interaction.user.id)) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Canale non concesso")
                .setColor(colors.yellow)
                .setDescription(`Puoi eseguire il comando say in tutti i canali solo dal ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level 60`).toString()}, ora puoi usarlo solo in <#${settings.idCanaliServer.commands}>`)

            interaction.reply({ embeds: [embed], ephemeral: true })

            let embed2 = new Discord.MessageEmbed()
                .setTitle(":construction: Channel not granted :construction:")
                .setColor(colors.yellow)
                .setThumbnail(interaction.guild.members.cache.get(interaction.user.id).displayAvatarURL({ dynamic: true }) || interaction.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":anchor: Channel", `#${client.channels.cache.get(interaction.channelId).name} - ID: ${interaction.channelId}`)

            if (comando) {
                let testoCommand = `/${comando.name}${interaction.options._subcommand ? `${interaction.options._subcommand} ` : ""}`
                interaction.options?._hoistedOptions?.forEach(option => {
                    testoCommand += ` ${option.name}: \`${option.value}\``
                })
                embed2.addField(":page_facing_up: Command", testoCommand.length > 1024 ? `${testoCommand.slice(0, 1021)}...` : testoCommand)
            }

            const maintenanceStatus = await isMaintenance()
            if (!maintenanceStatus) {
                client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
            }
            return
        }

        let text = interaction.options.getString("text")

        if (text.length > 4000) {
            return replyMessage(client, interaction, "Warning", "Testo troppo lungo", "Puoi scrivere un messaggio solo fino a 4000 caratteri", comando)
        }

        client.channels.cache.get(interaction.channelId).send({ content: text, allowedMentions: { parse: [] } })

        interaction.reply({ content: "Messaggio creato" })
        interaction.deleteReply()
    },
};