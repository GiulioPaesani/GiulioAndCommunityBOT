const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const { getServer } = require("../../functions/database/getServer");
const { replyMessage } = require("../../functions/general/replyMessage");
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { getEmoji } = require("../../functions/general/getEmoji");

module.exports = {
    name: "pmode",
    description: "Scegliere cosa si può inviare in una stanza privata",
    permissionLevel: 0,
    requiredLevel: 15,
    syntax: "/pmode [room]",
    category: "rooms",
    client: "general",
    data: {
        options: [
            {
                name: "room",
                description: "Scegli la stanza dove vuoi settare le modalità",
                type: "CHANNEL",
                required: true,
                channelTypes: ["GUILD_TEXT"]
            },
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
                return replyMessage(client, interaction, "NonPermesso", "", "Non puoi cambiare le modalità in questa stanza privata", comando)
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`${room.type == "text" ? getEmoji(client, "TextChannel") : getEmoji(client, "VoiceChannel")}  ${interaction.options.getChannel("room").name} MODE`)
            .setDescription("Impostare cosa gli altri utenti possono mandare nella tua stanza privata\n:warning: _Gli owner della stanza e i mod del server vengono ignorati in questi filtri e possono scrivere quello che vogliono_")
            .addField(`:thought_balloon: Messages - ${room.mode.messages ? ":green_circle:" : ":red_circle:"}`, "Qualsiasi tipo di testo, escluse le emoji")
            .addField(`:grinning: Emojis - ${room.mode.emoji ? ":green_circle:" : ":red_circle:"}`, "Emoji di Discord e emoji di questo o di altri server")
            .addField(`:label: Stickers - ${room.mode.sticker ? ":green_circle:" : ":red_circle:"}`, "Sticker di Discord e sticker di questo o di altri server")
            .addField(`:space_invader: Gif - ${room.mode.gif ? ":green_circle:" : ":red_circle:"}`, "Gif di Discord o caricate come file")
            .addField(`:frame_photo: Images - ${room.mode.image ? ":green_circle:" : ":red_circle:"}`, "Immagini caricate come file")
            .addField(`:video_camera: Videos - ${room.mode.video ? ":green_circle:" : ":red_circle:"}`, "Video caricati come file")
            .addField(`:file_folder: Files - ${room.mode.file ? ":green_circle:" : ":red_circle:"}`, "Qualsiasi tipo di file caricati, escluse immagini e video")

        let button1 = new Discord.MessageButton()
            .setEmoji("💭")
            .setStyle(room.mode.messages ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},messages,${room.mode.messages ? "1" : "0"}`)

        let button2 = new Discord.MessageButton()
            .setEmoji("😀")
            .setStyle(room.mode.emoji ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},emoji,${room.mode.emoji ? "1" : "0"}`)

        let button3 = new Discord.MessageButton()
            .setEmoji("🏷️")
            .setStyle(room.mode.sticker ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},sticker,${room.mode.sticker ? "1" : "0"}`)

        let button4 = new Discord.MessageButton()
            .setEmoji("👾")
            .setStyle(room.mode.gif ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},gif,${room.mode.gif ? "1" : "0"}`)

        let button5 = new Discord.MessageButton()
            .setEmoji("🖼️")
            .setStyle(room.mode.image ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},image,${room.mode.image ? "1" : "0"}`)

        let button6 = new Discord.MessageButton()
            .setEmoji("📹")
            .setStyle(room.mode.video ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},video,${room.mode.video ? "1" : "0"}`)

        let button7 = new Discord.MessageButton()
            .setEmoji("📁")
            .setStyle(room.mode.file ? "SUCCESS" : "DANGER")
            .setCustomId(`roomMode,${interaction.user.id},${room.channel},file,${room.mode.file ? "1" : "0"}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)
            .addComponents(button5)

        let row2 = new Discord.MessageActionRow()
            .addComponents(button6)
            .addComponents(button7)

        interaction.reply({ embeds: [embed], components: [row, row2] })
    },
};