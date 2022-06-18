const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "prename",
    description: "Rinominare il canale di una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/prename [room] [name]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza che vuoi rinominare",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
            },
            {
                name: "name",
                description: "Nome che vuoi dare alla stanza",
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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi aggiungere utenti a questa stanza privata", comando)
            }
        }

        if (interaction.options.getString("name").length > 100) {
            return replyMessage(client, interaction, "Warning", "Nome troppo lungo", "Puoi inserire un nome di massimo 100 caratteri", comando)
        }

        interaction.options.getChannel("room").setName(interaction.options.getString("name"))
            .then((channel) => {
                replyMessage(client, interaction, "Correct", "Canale rinominato", `Il canale <#${channel.id}> è stato rinominato`, comando)
            })
            .catch(() => {
                return replyMessage(client, interaction, "Error", "Nome non valido", `Hai inserito un nome per un canale non valido`, comando)
            })
    },
};