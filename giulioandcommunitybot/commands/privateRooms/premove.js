const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "premove",
    description: "Rimuovere un utente da una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/premove [room] [user]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza da cui vuoi rimuovere un utente",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
            },
            {
                name: "user",
                description: "Utente che si vuole rimuovere dalla stanza privata",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = getServer()

        if (getUserPermissionLevel(client, interaction.user.id) <= 1 && interaction.channelId != settings.idCanaliServer.commands && !serverstats.privateRooms.find(x => x.channel == interaction.channelId)) {
            return replyMessage(client, interaction, "CanaleNonConcesso", "", "", comando)
        }

        let room
        if (!serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)) {
            return replyMessage(client, interaction, "Error", "Stanza non trovata", "Il canale che hai scelto non è una stanza privata", comando)
        }
        else {
            room = serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)
            if (!room.owners.includes(interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) == 0) {
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere utenti da questa stanza privata", comando)
            }
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere questo utente dal ticket", comando)
        }

        if (room.owners.includes(utente.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere l'owner dalla sua stanza privata", comando)
        }

        const hasPermissionInChannel = client.channels.cache.get(room.channel)
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Utente già rimosso", "Questo utente non ha già accesso a questa stanza", comando)
        }

        client.channels.cache.get(room.channel).permissionOverwrites.edit(utente, {
            VIEW_CHANNEL: false
        })

        replyMessage(client, interaction, "Correct", "Utente rimosso", `${utente.toString()} è stato rimosso dalla stanza <#${room.channel}>`, comando)
    },
};