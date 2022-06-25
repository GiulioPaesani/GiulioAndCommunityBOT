const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "padmin",
    description: "Aggiungere o rimuovere un utente come admin di una stanza privata",
    permissionLevel: 0,
    requiredLevel: 40,
    cooldown: 10,
    syntax: "/padmin [add/remove] [room] [user]",
    category: "rooms",
    data: {
        options: [
            {
                name: "add",
                description: "Aggiungi un utente come admin ad una stanza privata",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "room",
                        description: "Scegli la stanza dove vuoi aggiungere l'utente come admin",
                        type: "CHANNEL",
                        required: true,
                        channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
                    },
                    {
                        name: "user",
                        description: "Utente che si vuole aggiungere come admin",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "remove",
                description: "Rimuovi un utente come admin ad una stanza privata",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "room",
                        description: "Scegli la stanza dove vuoi rimuovere l'utente dagli admin",
                        type: "CHANNEL",
                        required: true,
                        channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
                    },
                    {
                        name: "user",
                        description: "Utente che si vuole rimuovere dagli admin",
                        type: "STRING",
                        required: true
                    }
                ]
            },
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let serverstats = await getServer()

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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare gli utenti admin di questa stanza privata", comando)
            }
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (interaction.options.getSubcommand() == "add") {
            if (room.owners.includes(utente.id) || getUserPermissionLevel(client, utente.id) >= 1) {
                return replyMessage(client, interaction, "Warning", "Utente già admin", "L'utente che hai scelto è già un admin di questa stanza privata", comando)
            }

            room.owners.push(utente.id)

            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
            updateServer(serverstats)

            replyMessage(client, interaction, "Correct", "Admin aggiunto", `${utente.toString()} è stato aggiunto come admin nella stanza <#${room.channel}>`, comando)
        }
        else if (interaction.options.getSubcommand() == "remove") {
            if (!room.owners.includes(utente.id)) {
                return replyMessage(client, interaction, "Warning", "Utente non admin", "Questo utente non è un admin di questa stanza privata", comando)
            }

            if (getUserPermissionLevel(client, utente.id) >= 1) {
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi rimuovere questo utente dagli admin", comando)
            }

            if (utente.id == interaction.user.id) {
                return replyMessage(client, interaction, "Warning", "Non da solo", "Non ti puoi rimuovere da solo come admin di questa stanza", comando)
            }

            room.owners = room.owners.filter(x => x != utente.id)

            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
            updateServer(serverstats)

            replyMessage(client, interaction, "Correct", "Admin rimosso", `${utente.toString()} è stato rimosso come admin nella stanza <#${room.channel}>`, comando)
        }
    },
};