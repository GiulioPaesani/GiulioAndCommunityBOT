module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "approvaSuggestion") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var idUtente = button.message.embeds[0].fields[0].value.slice(button.message.embeds[0].fields[0].value.length - 19, -1)
        if (!idUtente) return

        var utente = client.users.cache.get(idUtente)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("💡Suggestion by " + (utente.username ? utente.username : utente.user.username))
            .setDescription(button.message.embeds[0].fields[2].value)
            .setThumbnail(button.message.embeds[0].thumbnail.url)
            .addField(":first_place: Votes", `
Opinion: **0**
Upvotes: **0** - 0%
Downvotes: **0** - 0%
`)

        var userstats = userstatsList.find(x => x.id == idUtente);
        if (!userstats) return
        userstats = addXp(userstats, userstats.level * 20)
        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var canale = client.channels.cache.find(channel => channel.id == settings.idCanaliServer.suggestions);
        canale.send({ embeds: [embed] })
            .then(msg => {
                msg.react("😍")
                msg.react("💩")

                var embed = new Discord.MessageEmbed()
                    .setTitle("💡Suggestion ACCETTATO")
                    .setColor("#18B83B")
                    .setDescription(`Un tuo suggerimento è stato **accettato** dallo staff, ora tutti gli utenti potranno votarlo\r[Clicca qui](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id}) per andare a vederlo`)
                    .addField(":bookmark_tabs: Suggestion", button.message.embeds[0].fields[2].value)

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                button.message.embeds[0].fields[1].value = "Approved by " + button.user.username
                button.message.embeds[0].color = "#18B83B"
                button.message.embeds[0].fields[2].value = `${button.message.embeds[0].fields[2].value}\r[Message](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`
                button.message.edit({ embeds: [button.message.embeds[0]], components: [] })
            })
    },
};