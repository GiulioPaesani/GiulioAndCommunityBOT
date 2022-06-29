const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "ptopic",
    description: "Cambiare il topic di una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/ptopic [room] [topic]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza dove vuoi settare il topic",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT"]
            },
            {
                name: "topic",
                description: "Topic che vuoi dare alla stanza",
                type: "STRING",
                required: true
            }
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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi cambiare il topic a questa stanza privata", comando)
            }
        }

        if (interaction.options.getString("topic").length > 1024) {
            return replyMessage(client, interaction, "Warning", "Topic troppo lungo", "Puoi inserire un topic di massimo 1024 caratteri", comando)
        }

        interaction.options.getChannel("room").setTopic(interaction.options.getString("topic"))
            .then((channel) => {
                replyMessage(client, interaction, "Correct", "Topic settato", `Il topic del canale <#${channel.id}> è stato settato`, comando)
            })
            .catch(() => {
                return replyMessage(client, interaction, "Error", "Topic non valido", `Hai inserito un topic per un canale non valido`, comando)
            })
    },
};