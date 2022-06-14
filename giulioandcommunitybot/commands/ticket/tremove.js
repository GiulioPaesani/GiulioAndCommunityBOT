const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "tremove",
    description: "Rimuovere un utente da un ticket",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/tremove [user]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "user",
                description: "Utente che si vuole rimuovere dal ticket",
                type: "STRING",
                required: true
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
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere utenti da questo ticket", comando)
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere questo utente dal ticket", comando)
        }

        if (utente.id == ticket.owner) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere l'owner dal suo ticket", comando)
        }

        const hasPermissionInChannel = client.channels.cache.get(interaction.channelId)
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Utente già rimosso", "Questo utente non ha già accesso a questo ticket", comando)
        }

        client.channels.cache.get(interaction.channelId).permissionOverwrites.edit(utente, {
            VIEW_CHANNEL: false
        })

        replyMessage(client, interaction, "Correct", "Utente rimosso", `${utente.toString()} è stato rimosso dal ticket`, comando)
    },
};