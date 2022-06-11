const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("approvaDomanda")) return

        if (getUserPermissionLevel(client, interaction.user.id) < 3) return replyMessage(client, interaction, "NonPermesso", "", "Non hai il permesso di approvare una domanda")

        interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: (utente.nickname || utente.user.username), iconURL: interaction.message.embeds[0].thumbnail.url })
            .setColor(colors.yellow)
            .setTitle(interaction.message.embeds[0].fields[2].value)
            .setDescription("_Domanda non ancora risposta_")

        client.channels.cache.get(settings.idCanaliServer.qna).send({ embeds: [embed] })
            .then(msg => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(":love_letter: Domanda ACCETTATA")
                    .setColor(colors.green)
                    .setDescription(`Una tua domanda è stata **accettata** dallo staff, ora tutti gli utenti potranno vederla\n[Clicca qui](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) per andare a vederla`)
                    .addField(":page_facing_up: Text", interaction.message.embeds[0].fields[2].value)

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                interaction.message.embeds[0].fields[1].value = `Approved by ${interaction.user.username}\n[Message](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
                interaction.message.embeds[0].color = colors.green

                interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
            })
    },
};
