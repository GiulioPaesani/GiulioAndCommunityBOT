const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "tadd",
    description: "Aggiungere un utente a un ticket",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/tadd [user]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "user",
                description: "Utente che si vuole aggiungere al ticket",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = getServer()
        let ticket = serverstats.tickets.find(x => x.channel == interaction.channelId)

        if (!ticket) {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }

        if (!interaction.user.id != ticket.owner && !getUserPermissionLevel(client, interaction.user.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi aggiungere utenti a questo ticket", comando)
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        const hasPermissionInChannel = client.channels.cache.get(interaction.channelId)
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Utente già presente", "Questo utente ha già accesso a questo ticket", comando)
        }

        client.channels.cache.get(interaction.channelId).permissionOverwrites.edit(utente, {
            VIEW_CHANNEL: true
        })

        replyMessage(client, interaction, "Correct", "Utente aggiunto", `${utente.toString()} è stato aggiunto al ticket`, comando)
    },
};