const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("approvaProgetto")) return

        interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: (utente.nickname || utente.user.username), iconURL: interaction.message.embeds[0].thumbnail.url })
            .setTitle(interaction.message.embeds[0].fields[2].value)
            .setDescription(interaction.message.embeds[0].fields[3].value)

        if (interaction.message.embeds[0].fields[4].value != "_Null_") {
            embed
                .setImage(interaction.message.embeds[0].fields[4].value.split("(")[interaction.message.embeds[0].fields[4].value.split("(").length - 1].slice(0, -1))
        }

        let row = new Discord.MessageActionRow()

        if (interaction.message.embeds[0].fields[5].value != "_Null_") {
            let button = new Discord.MessageButton()
                .setLabel(interaction.message.embeds[0].fields[5].value.split("]")[0].slice(1))
                .setStyle("LINK")
                .setURL(interaction.message.embeds[0].fields[5].value.split("(")[interaction.message.embeds[0].fields[5].value.split("(").length - 1].slice(0, -1))

            row.addComponents(button)
        }

        if (interaction.message.embeds[0].fields[6].value != "_Null_") {
            let button = new Discord.MessageButton()
                .setLabel(interaction.message.embeds[0].fields[6].value.split("]")[0].slice(1))
                .setStyle("LINK")
                .setURL(interaction.message.embeds[0].fields[6].value.split("(")[interaction.message.embeds[0].fields[6].value.split("(").length - 1].slice(0, -1))

            row.addComponents(button)
        }

        client.channels.cache.get(settings.idCanaliServer.ourProjects).send({ embeds: [embed], components: row.components.length > 0 ? [row] : [] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":newspaper: Progetto ACCETTATO")
                    .setColor(colors.green)
                    .setDescription(`Un tuo progetto è stato **accettato** dallo staff, ora tutti gli utenti vederlo nel canale <#${settings.idCanaliServer.ourProjects}>\n[Clicca qui](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) per andare a vederlo
                    
Se ti va, fai una domanda per far comparire il tuo progetto nella nuova serie "I vostri super progetti" su YouTube, compila subito il [FORM](https://forms.gle/8AWWj1kDeJhEnWQJ8)`)
                    .addField(interaction.message.embeds[0].fields[2].value, interaction.message.embeds[0].fields[3].value)

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                interaction.message.embeds[0].fields[1].value = `Approved by ${interaction.user.username}\n[Message](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
                interaction.message.embeds[0].color = colors.green

                interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
            })
    },
};
