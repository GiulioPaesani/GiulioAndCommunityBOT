const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../../config/general/settings.json")
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../database/updateServer");

const fineIscrizione = async (client) => {
    let serverstats = await getServer()

    serverstats.events.forEach(async event => {
        if (!event.finished && event.expiration_data <= new Date().getTime() && !event.expired) {
            const msg = await client.channels.cache.get(settings.idCanaliServer.events).messages.fetch(event.message)

            let button1 = new Discord.MessageButton()
                .setLabel("Iscriviti (Expired)")
                .setCustomId("iscriviti")
                .setStyle("SUCCESS")
                .setDisabled()

            let button2 = new Discord.MessageButton()
                .setLabel("Come funzionano gli eventi")
                .setCustomId("eventiTutorial")
                .setStyle("SECONDARY")

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            msg.edit({
                content: `
:no_entry_sign: Il tempo per iscriversi e partecipare all'evento è **terminato**
Ora siate pronti e attendete la data dell'evento per **divertirsi** assieme e scoprire il **vincitore**

:alarm_clock: Data evento: **${moment(event.data).format("DD/MM/YYYY HH:mm")}** sul canale Twitch di Giulio

:busts_in_silhouette: Partecipanti: **${event.partecipanti.length}**
_Le iscrizioni sono state chiuse il ${moment(event.expiration_data).format("DD/MM/YYYY HH:mm")}_
`, components: [row]
            })

            event.partecipanti.forEach(partecipante => {
                client.channels.cache.get(partecipante.channel).send(`:heart_hands: Grazie per esservi iscritti all'evento! State pronti per divertirci assieme il **${moment(event.data).format("DD/MM/YYYY HH:mm")}**`)
            })

            serverstats.events[serverstats.events.findIndex(x => x.message == event.message)].expired = true
            updateServer(serverstats)
        }
    })

}

module.exports = { fineIscrizione }