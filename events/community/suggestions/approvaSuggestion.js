const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("approvaSuggestion")) return

        interaction.deferUpdate().catch(() => { })

        let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.message.embeds[0].fields[0].value.slice(interaction.message.embeds[0].fields[0].value.length - 18))
        if (!utente) return

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: (utente.nickname || utente.user.username), iconURL: interaction.message.embeds[0].thumbnail.url })
            .setColor(colors.red)
            .setDescription(interaction.message.embeds[0].fields[2].value)
            .addField(":first_place: Opinion", `
Voto medio: **##**
${getEmoji(client, "suggest11")}${getEmoji(client, "suggest21")}${getEmoji(client, "suggest21")}${getEmoji(client, "suggest41")}
`)
            .setFooter({ text: "Dai un voto da 1 a 5 al suggerimento" })

        client.channels.cache.get(settings.idCanaliServer.suggestions).send({ embeds: [embed] })
            .then(msg => {
                msg.react(getEmoji(client, "vote1"))
                msg.react(getEmoji(client, "vote2"))
                msg.react(getEmoji(client, "vote3"))
                msg.react(getEmoji(client, "vote4"))
                msg.react(getEmoji(client, "vote5"))

                let embed = new Discord.MessageEmbed()
                    .setTitle("💡Suggestion ACCETTATO")
                    .setColor(colors.green)
                    .setDescription(`Un tuo suggerimento è stato **accettato** dallo staff, ora tutti gli utenti potranno votarlo\n[Clicca qui](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) per andare a vederlo`)
                    .addField(":page_facing_up: Suggestion", interaction.message.embeds[0].fields[2].value)

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                interaction.message.embeds[0].fields[1].value = `Approved by ${interaction.user.username}\n[Message](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
                interaction.message.embeds[0].color = colors.green

                interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [] })
            })
    },
};
