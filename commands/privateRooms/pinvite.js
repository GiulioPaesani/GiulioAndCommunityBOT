const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "pinvite",
    description: "Creare un invito per la propria stanza privata",
    permissionLevel: 0,
    requiredLevel: 25,
    cooldown: 20,
    syntax: "/pinvite [room] [description]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza a cui vuoi invitare",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT", "GUILD_VOICE"]
            },
            {
                name: "description",
                description: "Racconta di cosa parla la tua stanza per convincere gli utenti",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let description = interaction.options.getString("description")

        if (description.length > 1000) {
            return replyMessage(client, interaction, "Warning", "Descrizione troppo lunga", "Puoi scrivere una descrizione solo fino a 800 caratteri", comando)
        }

        let serverstats = getServer()

        let room
        if (!serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)) {
            return replyMessage(client, interaction, "Error", "Stanza non trovata", "Il canale che hai scelto non è una stanza privata", comando)
        }
        else {
            room = serverstats.privateRooms.find(x => x.channel == interaction.options.getChannel("room").id)
            if (!room.owners.includes(interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) == 0) {
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi creare un invito per questa stanza privata", comando)
            }
        }

        if (interaction.channelId == room.channel) {
            return replyMessage(client, interaction, "Warning", "Non nella tua stanza", "Esegui il comando in chat accessibili da altri utenti, in modo che possano entrare nella tua stanza", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":love_letter: Entra nella mia stanza privata")
            .setColor(colors.purple)
            .setDescription(`${interaction.user.toString()} vi invita ad entrare nella sua stanza privata
:point_right: Clicca "**Entra nella stanza**" per entrare in <#${room.channel}>

:postal_horn: **Di cosa si tratta?**
${description}`)


        let button1 = new Discord.MessageButton()
            .setLabel("Annulla invito")
            .setStyle("DANGER")
            .setCustomId(`annullaInvito,${room.channel}`)

        let button2 = new Discord.MessageButton()
            .setLabel("Entra nella stanza")
            .setStyle("PRIMARY")
            .setCustomId(`entraInvito,${room.channel}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};