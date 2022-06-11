const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("roomMode")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let serverstats = getServer()
        let room = serverstats.privateRooms.find(x => x.channel == interaction.customId.split(",")[2])
        if (!room) return

        room.mode[interaction.customId.split(",")[3]] = interaction.customId.split(",")[4] == "0" ? true : false

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
        updateServer(serverstats)

        let embed = new Discord.MessageEmbed()
            .setTitle(`${room.type == "text" ? getEmoji(client, "TextChannel") : getEmoji(client, "VoiceChannel")}  ${client.channels.cache.get(room.channel).name} MODE`)
            .setDescription("Impostare cosa gli altri utenti possono mandare nella tua stanza privata\n:warning: _Gli owner della stanza e i mod del server vengono ignorati in questi filtri e possono scrivere quello che vogliono_")
            .addField(`:thought_balloon: Messages - ${room.mode.messages ? ":green_circle:" : ":red_circle:"}`, "Qualsiasi tipo di testo, esluse le emoji")
            .addField(`:grinning: Emojis - ${room.mode.emoji ? ":green_circle:" : ":red_circle:"}`, "Emoji di Discord e emoji di questo o di altri server")
            .addField(`:label: Stickers - ${room.mode.sticker ? ":green_circle:" : ":red_circle:"}`, "Sticker di Discord e sticker di questo o di altri server")
            .addField(`:space_invader: Gif - ${room.mode.gif ? ":green_circle:" : ":red_circle:"}`, "Gif di Discord o caricate come file")
            .addField(`:frame_photo: Images - ${room.mode.image ? ":green_circle:" : ":red_circle:"}`, "Immagini caricate come file")
            .addField(`:video_camera: Videos - ${room.mode.video ? ":green_circle:" : ":red_circle:"}`, "Video caricati come file")
            .addField(`:file_folder: Files - ${room.mode.file ? ":green_circle:" : ":red_circle:"}`, "Qualsiasi tipo di file caricati, esluse immagini e video")

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

        interaction.message.edit({ embeds: [embed], components: [row, row2] })
    },
};