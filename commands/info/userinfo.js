const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

module.exports = {
    name: "userinfo",
    description: "Visualizzare informazioni di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 20,
    syntax: "/userinfo (user)",
    category: "info",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere le informazioni",
                type: "STRING",
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user
        utente = interaction.guild.members.cache.get(utente.id) || utente

        let textStatus = ""
        if (Object.keys(utente.presence?.clientStatus || {}).length <= 1)
            textStatus = !utente.presence ? `${getEmoji(client, "Offline")}Offline` : utente.presence.status == "online" ? `${utente.presence.clientStatus.mobile ? getEmoji(client, "MobileOnline") : getEmoji(client, "Online")}Online` : utente.presence.status == "dnd" ? `${getEmoji(client, "Donotdisturb")}Do not disturb` : `${getEmoji(client, "Idle")}Idle`
        else
            for (let index in utente.presence.clientStatus) {
                let status = utente.presence.clientStatus[index]
                textStatus += `${index == "web" ? "Web" : index == "desktop" ? "Desktop" : "Mobile"} -${status == "online" ? `${getEmoji(client, "Online")}Online` : status == "dnd" ? `${getEmoji(client, "Dotnotdisturb")}Do not disturb` : `${getEmoji(client, "Idle")}Idle`}\n`
            }

        let textDescription = ""
        if (utente.nickname) textDescription += `${utente.user.tag}\n`

        if (utente.presence?.activities[0]) {
            let activity = utente.presence?.activities[0]
            if (activity.type == "CUSTOM") {
                if (activity.emoji) {
                    if (!activity.emoji.id)
                        textDescription += `${activity.emoji.name} `
                }
                if (activity.state)
                    textDescription += `${activity.state} `
            }
            else {
                textDescription += `${activity.type == "PLAYING" ? "Sta giocando a" : activity.type == "LISTENING" ? "Sta ascoltando" : activity.type == "WATCHING" ? "Sta guardando" : ""} **${activity.name}**`
            }
        }

        let textRoles = ""
        utente._roles?.sort((a, b) => (interaction.guild.roles.cache.find(x => x.id == a).rawPosition < interaction.guild.roles.cache.find(x => x.id == b).rawPosition) ? 1 : ((interaction.guild.roles.cache.find(x => x.id == b).rawPosition < interaction.guild.roles.cache.find(x => x.id == a).rawPosition) ? -1 : 0))
            .forEach(roleId => {
                textRoles += `${interaction.guild.roles.cache.get(roleId).toString()}\n`
            })

        let textBadge = "";
        (utente.user || utente).flags?.toArray().forEach(badge => {
            switch (badge) {
                case "DISCORD_EMPLOYEE": { textBadge += getEmoji(client, "DiscordEmployee") } break
                case "PARTNERED_SERVER_OWNER": { textBadge += getEmoji(client, "PartnerdServerOwner") } break
                case "HYPESQUAD_EVENTS": { textBadge += getEmoji(client, "HypesquadEvents") } break
                case "BUGHUNTER_LEVEL_1": { textBadge += getEmoji(client, "BughunterLevel1") } break
                case "HOUSE_BRAVERY": { textBadge += getEmoji(client, "HouseBravery") } break
                case "HOUSE_BRILLIANCE": { textBadge += getEmoji(client, "HouseBrilliance") } break
                case "HOUSE_BALANCE": { textBadge += getEmoji(client, "HouseBalance") } break
                case "EARLY_SUPPORTER": { textBadge += getEmoji(client, "EarlySupporter") } break
                case "BUGHUNTER_LEVEL_2": { textBadge += getEmoji(client, "BughuterLevel2") } break
                case "EARLY_VERIFIED_BOT_DEVELOPER": { textBadge += getEmoji(client, "EarlyBotDeveloper") } break
                case "DISCORD_CERTIFIED_MODERATOR": { textBadge += getEmoji(client, "DiscordModerator") } break
            }
        })

        let user = await client.api.users(utente.id).get()

        let embed = new Discord.MessageEmbed()
            .setTitle(utente.nickname || utente.user?.tag || utente.tag)
            .setDescription(textDescription)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":receipt: User ID", utente.user?.id || utente.id, true)
            .addField(":ok_hand: Status", utente.user ? textStatus : "_User not into server_", true)
            .addField(":star2: Accent color", user.accent_color ? `#${user.accent_color.toString(16).toUpperCase()}` : "_Not set_", true)
            .addField(":pencil: Account created", `${moment(utente.user?.createdAt || utente.createdAt).format("ddd DD MMM YYYY, HH:mm")} (${moment(utente.user?.createdAt || utente.createdAt).fromNow()})`)
            .addField(":red_car: Joined this server", utente.user ? `${moment(getUser(utente.id)?.joinedAt || utente.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm")} (${moment(getUser(utente.id)?.joinedAt || utente.joinedTimestamp).fromNow()})` : "_User never joined the server_")
            .addField(":shirt: Roles", textRoles || "_No roles_")
            .addField(":beginner: Badge", textBadge || "_No badges_")

        interaction.reply({ embeds: [embed] })
    },
};