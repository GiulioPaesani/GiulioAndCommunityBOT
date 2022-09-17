const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("confermaTerminaEvento")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate()
            .catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let serverstats = await getServer()
        let event = serverstats.events.find(x => x.message == interaction.customId.split(",")[2])
        if (!event) return

        let partecipanti = event.partecipanti.sort((a, b) => ((a.chatpoints + a.giuliopoints) < (b.chatpoints + b.giuliopoints)) ? 1 : (((b.chatpoints + b.giuliopoints) < (a.chatpoints + a.giuliopoints)) ? -1 : 0));
        let list = ""

        let totPage = Math.ceil(partecipanti.length / 10)
        let page = 1;

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (partecipanti[i]) {
                if (event.finished || event.started) {
                    switch (i) {
                        case 0:
                            list += ":first_place: ";
                            break
                        case 1:
                            list += ":second_place: "
                            break
                        case 2:
                            list += ":third_place: "
                            break
                        default:
                            list += `**#${i + 1}** `
                    }
                }
                else list += `**#${i + 1}** `

                let utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == partecipanti[i].user);

                list += `${utente.toString()} - ${partecipanti[i].chatpoints + partecipanti[i].giuliopoints} (${partecipanti[i].chatpoints} + ${partecipanti[i].giuliopoints})\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Evento terminato")
            .setColor(colors.green)
            .setDescription("Sono stati pubblicati tutti i voti nella classifica definitiva")
            .addFields([
                {
                    name: ":medal: Classifica Top 10",
                    value: list
                }
            ])

        interaction.message.edit({ embeds: [embed], components: [] })

        const msg = await client.channels.cache.get(settings.idCanaliServer.events).messages.fetch(event.message)

        msg.edit({
            content: `
:trident: L'evento è **terminato**! Abbiamo analizzato tutti i partecipanti e deciso il vincitore

Congratulazione, <@${partecipanti[0].user}> per aver **vinto** questo evento!
:nazar_amulet: Scopri la classifica completa nel comando </events:1019153822448365588>

Se ti sei perso la diretta, riguardala su **GiulioAndLive** per scoprire le motivazioni di ogni voto
<https://www.youtube.com/channel/UCdwJnxZFfggSuXrLrc5sfPg>

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
`, components: [], allowedMentions: { parse: [] }
        })

        event.partecipanti.forEach(partecipante => {
            if (partecipanti[0].user == partecipante.user) {
                client.channels.cache.get(partecipante.channel).send(`L'evento è **terminato**!\n:first_place: Congratulazioni <@${partecipante.user}> per aver **vinto** questo evento!\nEcco il tuo punteggio: **${partecipante.chatpoints + partecipante.giuliopoints}** (${partecipante.chatpoints} + ${partecipante.giuliopoints})`)
                client.channels.cache.get(partecipante.channel).send({ content: `Vincendo l'evento hai guadagnato il ruolo <@&${settings.idRuoloEventWinner}>`, allowedMentions: { parse: [] } })

                interaction.message.guild.members.cache.get(partecipante.user).roles.add(settings.idRuoloEventWinner)
            }
            else if (partecipanti[1].user == partecipante.user) {
                client.channels.cache.get(partecipante.channel).send(`L'evento è **terminato**!\n:first_place: Grande <@${partecipante.user}>, sei arrivato **secondo** in questo evento! Per un pelo...\nEcco il tuo punteggio: **${partecipante.chatpoints + partecipante.giuliopoints}** (${partecipante.chatpoints} + ${partecipante.giuliopoints})`)

            }
            else if (partecipanti[2].user == partecipante.user) {
                client.channels.cache.get(partecipante.channel).send(`L'evento è **terminato**!\n:first_place: Bravo <@${partecipante.user}>, sei arrivato **terzo** in questo evento! Un sforzo in più e potevi vincere...\nEcco il tuo punteggio: **${partecipante.chatpoints + partecipante.giuliopoints}** (${partecipante.chatpoints} + ${partecipante.giuliopoints})`)
            }
            else {
                client.channels.cache.get(partecipante.channel).send(`L'evento è **terminato**!\n<@${partecipante.user}> ecco il tuo punteggio: **${partecipante.chatpoints + partecipante.giuliopoints}** (${partecipante.chatpoints} + ${partecipante.giuliopoints})`)

            }
        })

        serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].finished = true
        updateServer(serverstats)
    },
};