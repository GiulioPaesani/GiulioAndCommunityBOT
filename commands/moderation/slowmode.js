const ms = require("ms")
const { replyMessage } = require("../../functions/general/replyMessage")

module.exports = {
    name: "slowmode",
    description: "Impostare il tempo di scrittura di un utente in un canale",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/slowmode [time]",
    category: "moderation",
    data: {
        options: [
            {
                name: "time",
                description: "Tempo di slowmode",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let time = interaction.options.getString("time")

        let tempo;
        if (time == "off" || time == "no" || ms(time) == 0)
            time = 0
        else {
            time = ms(time)

            if (!time || time < 1000) {
                return replyMessage(client, interaction, "Error", "Tempo non valido", "Scrivi un tempo di slowmode valido", comando)
            }

            if (time > 21600000) {
                return replyMessage(client, interaction, "Error", "Troppa slowmode", "Inserisci un tempo non superiore a 6 ore", comando)
            }

            tempo = ms(time, { long: true });
            tempo = tempo + " "
            tempo = tempo.replace("second ", "secondo")
            tempo = tempo.replace("seconds", "secondi")
            tempo = tempo.replace("minute ", "minuto ")
            tempo = tempo.replace("minutes", "minuti")
            tempo = tempo.replace("hour ", "ora ")
            tempo = tempo.replace("hours", "ore")
        }

        client.channels.cache.get(interaction.channelId).setRateLimitPerUser(time / 1000)

        replyMessage(client, interaction, "Correct", "Slowmode impostata", time == 0 ? "Slowmode disattivata" : `Slowmode impostata a **${tempo}**`)
    },
};