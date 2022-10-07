const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const { getServer } = require("../../database/getServer");
const { updateServer } = require("../../database/updateServer");

const inizioEvento = async (client) => {
    let serverstats = await getServer()

    serverstats.events.forEach(async event => {
        if (!event.finished && event.data <= new Date().getTime() && !event.started) {
            const msg = await client.channels.cache.get(settings.idCanaliServer.events).messages.fetch(event.message)

            let button1 = new Discord.MessageButton()
                .setLabel("Come funzionano gli eventi")
                .setCustomId("eventiTutorial")
                .setStyle("SECONDARY")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            msg.edit({
                content: `
:purple_circle: L'evento è **iniziato**! Vieni in live sul canale Twitch di Giulio per scoprire tutti i partecipanti
<https://twitch.tv/giulioandcode>

:bar_chart: Uno a uno si **voteranno** tutti i progetti dei partecipanti attraverso il **voto della chat** e di Giulio, che rimarrà segreto fino alla fine, per poi scoprire il **vincitore**

Scopri la **classifica provvisoria** con solo i voti della chat attraverso il comando </events:1019153822448365588>

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
`, components: [row]
            })

            event.partecipanti.forEach(partecipante => {
                client.channels.cache.get(partecipante.channel).send(`:purple_circle: L'evento è finalmente **iniziato**! Vieni in live con Giulio per scoprire tutti i partecipanti e decidere insieme il **vincitore**`)
            })

            serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].started = true
            updateServer(serverstats)
        }
    })

}

module.exports = { inizioEvento }