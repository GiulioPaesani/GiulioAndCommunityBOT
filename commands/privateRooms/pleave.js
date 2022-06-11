const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "pleave",
    description: "Uscire da una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/pleave [room]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza da cui vuoi uscire",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
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

            if (room.owners.includes(interaction.user.id)) {
                return replyMessage(client, interaction, "Warning", "Non puoi uscire", "Non puoi uscire dalla tua stanza", comando)
            }
            if (getUserPermissionLevel(client, interaction.user.id) >= 2) {
                return replyMessage(client, interaction, "Warning", "Non puoi uscire", "Sei amministratore nel server, non puoi uscire dalla stanza", comando)
            }
        }

        client.channels.cache.get(room.channel).permissionOverwrites.edit(interaction.member, {
            VIEW_CHANNEL: false
        })

        replyMessage(client, interaction, "Correct", "Ti sei rimosso", `${utente.toString()} ha lasciato la stanza <#${room.channel}>`, comando)
    },
};