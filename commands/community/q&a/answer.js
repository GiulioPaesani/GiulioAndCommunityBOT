const settings = require("../../../config/general/settings.json");
const colors = require("../../../config/general/colors.json");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: "answer",
    description: "Rispondere a una domanda fatta dagli utenti",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/answer [domanda] [risposta] (video)",
    category: "community",
    data: {
        options: [
            {
                name: "domanda",
                description: "ID del messaggio della domanda",
                type: "STRING",
                required: true
            },
            {
                name: "risposta",
                description: "Testo della risposta",
                type: "STRING",
                required: true
            },
            {
                name: "video",
                description: "Link del punto del video in cui viene risposta la domanda",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let domanda = interaction.options.getString("domanda")
        let risposta = interaction.options.getString("risposta")
        let video = interaction.options.getString("video")

        if (risposta.length > 3500) {
            return replyMessage(client, interaction, "Warning", "Risposta troppo lunga", "Puoi scrivere una risposta solo fino a 3500 caratteri", comando)
        }

        client.channels.cache.get(settings.idCanaliServer.qna).messages.fetch(domanda)
            .then(msg => {
                msg.embeds[0].color = colors.purple
                msg.embeds[0].description = `${risposta}${video ? `\n\n:projector: Per maggiori dettagli [guarda il video](${video})` : ""}`

                msg.edit({ embeds: [msg.embeds[0]] })

                replyMessage(client, interaction, "Correct", "Domanda risposta", "La domanda è stata risposta correttamente", comando)
            })
            .catch(() => {
                return replyMessage(client, interaction, "Error", "Domanda non trovata", "Hai inserito un ID di un messaggio che non corrisponde a una domanda", comando)
            })
    },
};