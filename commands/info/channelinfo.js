const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "channelinfo",
    description: "Visualizzare informazioni di un canale",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/channelinfo (channel)",
    category: "info",
    data: {
        options: [
            {
                name: "channel",
                description: "Canale di cui vedere le informazioni",
                type: "CHANNEL",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let canale = interaction.options.getChannel("channel") || client.channels.cache.get(interaction.channelId)

        let canaleType = ""
        let canaleEmoji = ""

        switch (canale.type) {
            case "GUILD_TEXT": {
                canaleType = "Text Channel"
                canaleEmoji = canale.permissionsFor(interaction.guild.roles.everyone).has("VIEW_CHANNEL") ? getEmoji(client, "TextChannel") : getEmoji(client, "PrivateTextChannel")
            }; break;
            case "GUILD_VOICE": {
                canaleType = "Voice Channel"
                canaleEmoji = !canale.permissionsFor(interaction.guild.roles.everyone).has("CONNECT") || !canale.permissionsFor(interaction.guild.roles.everyone).has("VIEW_CHANNEL") ? getEmoji(client, "PrivateVoiceChannel") : getEmoji(client, "VoiceChannel")
            }; break;
            case "GUILD_CATEGORY": {
                canaleType = "Category"
            }; break;
            case "GUILD_NEWS": {
                canaleType = "News Channel"
                canaleEmoji = getEmoji(client, "NewsChannel")
            }; break;
            case "GUILD_NEWS_THREAD": {
                canaleType = "News Thread"
                canaleEmoji = getEmoji(client, "NewsThread")
            }; break;
            case "GUILD_PUBLIC_THREAD": {
                canaleType = "Public Thread"
                canaleEmoji = getEmoji(client, "PublicThread")
            }; break;
            case "GUILD_PRIVATE_THREAD": {
                canaleType = "Private Thread";
                canaleEmoji = getEmoji(client, "PrivateThread")
            } break;
            case "GUILD_STAGE_VOICE": {
                canaleType = "Stage Channel";
                canaleEmoji = !canale.permissionsFor(interaction.guild.roles.everyone).has("CONNECT") || !canale.permissionsFor(interaction.guild.roles.everyone).has("VIEW_CHANNEL") ? getEmoji(client, "PrivateStageChannel") : getEmoji(client, "StageChannel")
            } break;
        }

        if (canale.id == interaction.guild.rulesChannelId) {
            canaleType = "Rules Channel"
            canaleEmoji = getEmoji(client, "RulesChannel")
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`${canaleEmoji}   ${canale.name}`)
            .setDescription("Tutte le informazioni su questo canale")
            .addField(":receipt: Channel ID", canale.id, true)
            .addField(":thought_balloon: Type", canaleType || "Unknown", true)
            .addField(":pencil: Channel created", `${moment(canale.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(canale.createdAt).fromNow()})`)

        if (canaleType == "Text Channel" || canaleType == "News Channel") {
            embed
                .addField(":bricks: Category", canale.parent?.name || "_No category_", true)
                .addField(":snail: Slowmode", canale.rateLimitPerUser == 0 ? "_No slowmode_" : ms(canale.rateLimitPerUser * 1000, { long: true }), true)
                .addField(":notepad_spiral: Topic", canale.topic || "_No topic_")
        }
        if (canaleType == "News Thread" || canaleType == "Public Thread" || canaleType == "Private Thread") {
            embed
                .addField(":bricks: Main Channel", client.channels.cache.get(canale.parentId).name, true)
                .addField(":snail: Slowmode", ms(canale.rateLimitPerUser * 1000, { long: true }), true)
                .addField(":notepad_spiral: Topic", canale.topic || "_No topic_")
        }
        if (canaleType == "Stage Channel") {
            embed
                .addField(":1234: Position", canale.position.toString(), true)
                .addField(":bricks: Category", canale.parent?.name || "_No category_", true)
        }
        else if (canaleType == "Voice Channel") {
            embed
                .addField(":1234: Position", canale.position.toString(), true)
                .addField(":bricks: Category", canale.parent?.name || "_No category_", true)
                .addField(":loud_sound: Bitrate", canale.bitrate.toString(), true)
                .addField(":bust_in_silhouette: User limit", canale.userLimit == 0 ? "∞" : canale.userLimit.toString(), true)
        }
        if (canaleType == "Category") {
            embed
                .addField(":1234: Position", canale.position.toString(), true)
                .addField(":bricks: Channels inside", interaction.guild.channels.cache.filter(x => x.parentId == canale.id).size.toString(), true)
        }

        interaction.reply({ embeds: [embed] })
    },
};