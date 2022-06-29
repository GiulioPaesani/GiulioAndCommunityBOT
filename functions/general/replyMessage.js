const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance.js")

const replyMessage = async (client, interaction, type, title, description, comando, fields, components) => {
    let embed = new Discord.MessageEmbed()
    let embed2 = new Discord.MessageEmbed()
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

    switch (type) {
        case "Error": {
            embed
                .setTitle(title)
                .setColor(colors.red)
                .setDescription(`${description}\n_Sinstassi comando: \`${comando.syntax}\`_`)

            embed2
                .setTitle(":no_entry: Error :no_entry:")
                .setColor(colors.red)
        } break
        case "Warning": {
            embed
                .setTitle(title)
                .setColor(colors.gray)
                .setDescription(description)

            embed2
                .setTitle(":grey_exclamation: Warning :grey_exclamation:")
                .setColor(colors.gray)
        } break
        case "InsufficientLevel": {
            embed
                .setTitle("Livello insufficiente")
                .setColor(colors.pink)
                .setDescription(comando ? `Per utilizzare il comando \`/${comando.name}\` è necessario almeno il ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${comando.requiredLevel}`).toString()} o **boostare** il server` : description)

            embed2
                .setTitle(":candle: Insuffiencient level :candle:")
                .setColor(colors.pink)
        } break
        case "Correct": {
            embed
                .setTitle(title)
                .setColor(colors.blue)
                .setDescription(description)
        } break
        case "NonPermesso": {
            embed
                .setTitle("Non hai il permesso")
                .setColor(colors.purple)
                .setDescription(description ? description : `Non hai i permessi necessari per utilizzare il comando \`/${comando.name}\``)

            embed2
                .setTitle(":crossed_swords: Command not allowed :crossed_swords:")
                .setColor(colors.purple)
        } break
        case "NonHoPermesso": {
            embed
                .setTitle("Non ho il permesso")
                .setColor(colors.purple)
                .setDescription(description)

            embed2
                .setTitle(":crossed_swords: Member not allowed :crossed_swords:")
                .setColor(colors.purple)
        } break
        case "CanaleNonConcesso": {
            let canaliConcessiLista = "";
            comando.channelsGranted.forEach(idCanale => {
                canaliConcessiLista += `<#${idCanale}>\n`
            })

            embed
                .setTitle("Canale non concesso")
                .setColor(colors.yellow)
                .setDescription(`Non puoi utilizzare il comando \`/${comando.name}\` in questo canale
${canaliConcessiLista ? `_Puoi utilizzare questo comando in:_\n${canaliConcessiLista}` : ""}`)

            embed2
                .setTitle(":construction: Channel not granted :construction:")
                .setColor(colors.yellow)
        } break
    }

    if (fields) {
        fields.forEach(field => {
            embed
                .addField(field.name || "\u200b", field.value)
        })
    }

    interaction.reply({ embeds: [embed], components: components ? components : [], ephemeral: type != "Correct" && !components ? true : false })
        .catch(() => {
            interaction.followUp({ embeds: [embed], components: components ? components : [], ephemeral: type != "Correct" && !components ? true : false })
                .catch(() => {
                    interaction.user.send({ embeds: [embed], components: components ? components : [] })
                        .catch(() => { })
                })
        })

    if (description)
        embed2
            .addField(":envelope: Error message", description)

    const maintenanceStatus = await isMaintenance()
    if (!maintenanceStatus && comando && type != "Correct") {
        client.channels.cache.get(log.commands.allCommands).send({ embeds: [embed2] })
        return true
    }
}

module.exports = { replyMessage }