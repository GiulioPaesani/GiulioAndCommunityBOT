const Discord = require('discord.js');
const moment = require('moment');
const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getEmoji } = require('../../functions/general/getEmoji');

module.exports = {
    name: "pinfo",
    description: "Ottenere le informazioni di una stanza privata",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/pinfo [room]",
    category: "rooms",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza di cui vuoi vedere le informazioni",
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
        }

        let ownersList = ""
        let i = 0

        while (room.owners[i] && ownersList.length + `- ${client.users.cache.get(room.owners[i])?.toString()} - ID: ${room.owners[i]}\n`.length < 900) {
            ownersList += `- ${client.users.cache.get(room.owners[i])?.toString()} - ID: ${room.owners[i]}\n`
            i++
        }

        if (room.owners.length > i)
            ownersList += `Altri ${room.owners.length - i}...`

        let embed = new Discord.MessageEmbed()
            .setTitle(`${room.type == "text" ? getEmoji(client, "PrivateTextChannel") : getEmoji(client, "PrivateVoiceChannel")}  ${interaction.options.getChannel("room").name}`)
            .setDescription("Informazioni su questa stanza privata")
            .addField(":gem: Owners", ownersList)
            .addField(":thought_balloon: Type", room.type == "text" ? "Text" : "Voice", true)
            .addField(":pencil: Channel created", `${moment(interaction.options.getChannel("room").createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(interaction.options.getChannel("room").createdAt).fromNow()})`, true)
            .addField(":notepad_spiral: Topic", interaction.options.getChannel("room").topic || "_No topic_")
            .addField(":no_entry: Mode", `
:thought_balloon: Messages - ${room.mode.messages ? ":green_circle:" : ":red_circle:"}
:grinning: Emojis - ${room.mode.emoji ? ":green_circle:" : ":red_circle:"}
:label: Stickers - ${room.mode.sticker ? ":green_circle:" : ":red_circle:"}
:space_invader: Gif - ${room.mode.gif ? ":green_circle:" : ":red_circle:"}
:frame_photo: Images - ${room.mode.image ? ":green_circle:" : ":red_circle:"}
:video_camera: Videos - ${room.mode.video ? ":green_circle:" : ":red_circle:"}
:file_folder: Files - ${room.mode.file ? ":green_circle:" : ":red_circle:"}`)

        interaction.reply({ embeds: [embed] })
    },
};