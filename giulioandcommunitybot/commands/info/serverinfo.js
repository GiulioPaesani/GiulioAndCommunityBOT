const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "serverinfo",
    description: "Visualizzare informazioni sul server",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/serverinfo",
    category: "info",
    client: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let server = interaction.guild;

        let textEmojis = `Total: ${server.emojis.cache.size} | Static: ${server.emojis.cache.filter(x => !x.animated).size} | Animated: ${server.emojis.cache.filter(x => x.animated).size}\n`

        let index = 0
        while ((textEmojis.length + server.emojis.cache.map(x => x)[index].toString().length) < 1000) {
            textEmojis += `${server.emojis.cache.map(x => x)[index].toString()} `
            index++
        }
        if (index < server.emojis.cache.size)
            textEmojis += `Altre ${server.emojis.cache.size - index}...`

        let textStickers = `Total: ${server.stickers.cache.size} | Static: ${server.stickers.cache.filter(x => x.format != "APNG").size} | Animated: ${server.stickers.cache.filter(x => x.format == "APNG").size}\n`
        server.stickers.cache.forEach(sticker => {
            textStickers += `${client.emojis.cache.find(x => x.name == sticker.name).toString()} `
        })

        let embed = new Discord.MessageEmbed()
            .setTitle(server.name)
            .setDescription(server.description)
            .setThumbnail(server.iconURL({ dynamic: true }))
            .addField(":technologist: Owner", client.users.cache.get(server.ownerId).toString(), true)
            .addField(":placard: Server ID", server.id, true)
            .addField(":busts_in_silhouette: Members", `Total: ${server.memberCount} | Members: ${server.memberCount - server.members.cache.filter(member => member.user.bot).size} | Bots: ${server.members.cache.filter(member => member.user.bot).size}`)
            .addField(":loud_sound: Channels", `Text: ${server.channels.cache.filter(c => c.type == "GUILD_TEXT").size} | Voice: ${server.channels.cache.filter(c => c.type == "GUILD_VOICE").size} | Category: ${server.channels.cache.filter(c => c.type == "GUILD_CATEGORY").size} | Other: ${server.channels.cache.filter(c => c.type != "GUILD_TEXT" && c.type != "GUILD_VOICE" && c.type != "GUILD_CATEGORY").size}`)
            .addField(":calendar_spiral: Server created", `${moment(server.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(server.createdAt).fromNow()})`)
            .addField(":green_circle: Users", `
${getEmoji(client, "Online")}Online: ${server.members.cache.filter(user => user.presence?.status == "online").size}
${getEmoji(client, "Donotdisturb")}Do not disturb: ${server.members.cache.filter(user => user.presence?.status == "dnd").size}
${getEmoji(client, "Idle")}Idle: ${server.members.cache.filter(user => user.presence?.status == "idle").size}
${getEmoji(client, "Offline")}Offline: ${server.members.cache.filter(user => !user.presence || user.presence?.status == "offline").size}
`, true)
            .addField(":beginner: Boost level", `Level ${server.premiumTeam == "NONE" ? 0 : server.premiumTeam == "TIER_1" ? 1 : server.premiumTeam == "TIER_2" ? 2 : 3} (${server.premiumSubscriptionCount} Boosts)`, true)
            .addField(":stuck_out_tongue_winking_eye: Emojis", textEmojis)
            .addField(":frame_photo: Stickers", textStickers)

        interaction.reply({ embeds: [embed] })
    },
};