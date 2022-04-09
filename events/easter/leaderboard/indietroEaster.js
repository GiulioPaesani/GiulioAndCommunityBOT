module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("indietroEaster")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        let userstatsList = serverstats.easter

        userstatsList = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.get(x.id)).sort((a, b) => b.points - a.points)

        let totPage = Math.ceil(userstatsList.length / 10)
        var page = parseInt(button.customId.split(",")[2]) - 1;
        if (page < 1) return
        let classifica = ""

        for (var i = 10 * (page - 1); i < 10 * page; i++) {
            if (userstatsList[i]) {
                switch (i) {
                    case 0:
                        classifica += ":first_place: ";
                        break
                    case 1:
                        classifica += ":second_place: "
                        break
                    case 2:
                        classifica += ":third_place: "
                        break
                    default:
                        classifica += `**#${i + 1}** `
                }

                var utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstatsList[i].id)

                classifica += `${utente.nickname ? utente.nickname : utente.user.username} - **${userstatsList[i].points}**\r`
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(":hatching_chick: Leaderboard evento PASQUALE :dove:")
            .setColor("#EF7A98")
            .setDescription("Risolvi le **sfide** e scala la classifica\r\r:trophy: I primi 5 utenti in classifica al termine dell'evento guadagneranno **super premi extra**" + `
La tua posizione: ${userstatsList.findIndex(x => x.id == button.user.id) >= 0 ? (userstatsList.findIndex(x => x.id == button.user.id) + 1) : "##"}/${userstatsList.length}`)
            .addField("\u200b", classifica || "_Nessun utente in classifica al momento_")
            .setFooter({ text: `Page ${totPage == 0 ? 0 : page}/${totPage}` })

        var button1 = new Discord.MessageButton()
            .setCustomId(`indietro2Easter,${button.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("⏮️")

        var button2 = new Discord.MessageButton()
            .setCustomId(`indietroEaster,${button.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("◀️")

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        var button3 = new Discord.MessageButton()
            .setCustomId(`avantiEaster,${button.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("▶️")

        var button4 = new Discord.MessageButton()
            .setCustomId(`avanti2Easter,${button.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji("⏭️")

        if (page == totPage || totPage == 0) {
            button3.setDisabled()
            button4.setDisabled()
        }

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        button.message.edit({ embeds: [embed], components: [row] })
    },
};