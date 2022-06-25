const Discord = require('discord.js');
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "padd",
    description: "Aggiungere un utente a una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/padd [room] [user]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza a cui vuoi aggiungere un utente",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
            },
            {
                name: "user",
                description: "Utente che si vuole aggiungere alla stanza privata",
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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi aggiungere utenti a questa stanza privata", comando)
            }
        }

        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        const hasPermissionInChannel = client.channels.cache.get(room.channel)
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return replyMessage(client, interaction, "Warning", "Utente già presente", "Questo utente ha già accesso a questa stanza", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Accetta l'aggiunta")
            .setColor(colors.yellow)

        let button1 = new Discord.MessageButton()
            .setLabel("Rifiuta invito")
            .setStyle("DANGER")
            .setCustomId(`rifiutaInvito,${utente.id},${room.channel}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Entra nella stanza")
            .setStyle("PRIMARY")
            .setCustomId(`accettaInvito,${utente.id},${room.channel}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        if (room.channel == interaction.channelId) {
            embed
                .setDescription(`${utente.toString()} deve accettare l'aggiunta alla stanza premendo "**Entra nella stanza**" nel messaggio che ha ricevuto in DM`)

            interaction.reply({ embeds: [embed] })

            let embed2 = new Discord.MessageEmbed()
                .setTitle("Accetta l'aggiunta")
                .setColor(colors.yellow)
                .setDescription(`Sei stato **invitato** ad entrare nella stanza privata #${client.channels.cache.get(room.channel).name}\nSe vuoi entrare premi "**Entra nella stanza**" altrimenti rifiuta l'invito`)

            utente.send({ embeds: [embed2], components: [row] })
        }
        else {
            embed
                .setDescription(`${utente.toString()} deve accettare l'aggiunta alla stanza premendo "**Entra nella stanza**" in questo messaggio o in quello che ha ricevuto in DM`)

            interaction.reply({ embeds: [embed], components: [row] })
        }

    },
};