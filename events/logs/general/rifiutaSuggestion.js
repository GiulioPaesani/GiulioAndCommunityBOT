module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "rifiutaSuggestion") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var idUtente = button.message.embeds[0].fields[0].value.slice(button.message.embeds[0].fields[0].value.length - 19, -1)
        if (!idUtente) return

        var utente = client.users.cache.get(idUtente)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("💡Suggestion RIFIUTATO")
            .setColor("#ED4245")
            .setDescription(`Un tuo suggerimento è stato purtroppo **rifiutato** dallo staff`)
            .addField(":bookmark_tabs: Suggestion", button.message.embeds[0].fields[2].value)

        utente.send({ embeds: [embed] })
            .catch(() => { })

        button.message.embeds[0].fields[1].value = "Refused by " + button.user.username
        button.message.embeds[0].color = "#ED4245"

        button.message.edit({ embeds: [button.message.embeds[0]], components: [] })
    },
};