module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "rifiutaChallenge") return

        var idUtente = button.message.embeds[0].fields[0].value.slice(button.message.embeds[0].fields[0].value.length - 22, -4)
        if (!idUtente) return

        var utente = client.users.cache.get(idUtente)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("🎯Challenge RIFIUTATA")
            .setColor("#ED4245")
            .setDescription(`Una tua sfida è stata purtroppo **rifiutata** dallo staff`)
            .addField(":bookmark_tabs: Challenge", button.message.embeds[0].fields[2].value)

        utente.send(embed)
            .catch(() => { return })

        button.message.embeds[0].fields[1].value = "```Refused by " + button.clicker.user.username + "```"
        button.message.embeds[0].color = "15548997"

        button.message.edit(button.message.embeds[0], null)
    },
};