const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "pkick",
    description: "Espellere un utente da una stanza vocale privata",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/pkick [room] [user]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza da cui vuoi espellere un utente",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_VOICE"]
            },
            {
                name: "user",
                description: "Utente che si vuole espellere dalla stanza privata",
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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi espellere utenti da questa stanza privata", comando)
            }
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi espellere questo utente dal ticket", comando)
        }

        if (room.owners.includes(utente.id)) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi espellere l'owner dalla sua stanza privata", comando)
        }

        utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == utente.id)
        if (!utente.voice) {
            return replyMessage(client, interaction, "Warning", "Utente non in vocale", "L'utente non è collegato alla stanza vocale", comando)
        }

        utente.voice.disconnect()

        replyMessage(client, interaction, "Correct", "Utente espulso", `${utente.toString()} è stato espulso dalla stanza <#${room.channel}>, ma potrà rientrare quando vuole`, comando)
    },
};