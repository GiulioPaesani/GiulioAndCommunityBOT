const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const settings = require("../../../config/general/settings.json")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { getUser } = require("../../../functions/database/getUser")
const { addUser } = require("../../../functions/database/addUser");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { updateUser } = require("../../../functions/database/updateUser");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")

module.exports = {
    name: "unban",
    description: "Sbannare un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/unban [user]",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da sbannare",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi sbannare un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi sbannare questo utente", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        if (userstats.moderation.type != "Banned" && userstats.moderation.type != "Tempbanned" && userstats.moderation.type != "Forcebanned") {
            return replyMessage(client, interaction, "Warning", "Utente non bannato", "Questo utente non è bannato", comando)
        }

        if (interaction.guild.members.cache.get(utente.id)) {
            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.banned)
            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.tempbanned)
        }
        else {
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.banned)
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempbanned)
        }

        interaction.guild.members.unban(utente.id)
            .catch(() => { })

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[UNBAN] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(illustrations.ban)
            .setColor(colors.purple)
            .addField(":shield: Moderator", interaction.user.toString())
            .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
            .addField(":hourglass: Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
            .setFooter({ text: "User ID: " + utente.id })

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        embed = new Discord.MessageEmbed()
            .setTitle(":name_badge: Unban :name_badge:")
            .setColor(colors.purple)
            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
            .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
            .addField(":hourglass: Time banned", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`)

        if (!isMaintenance())
            client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
            .setTitle("Sei stato sbannato")
            .setColor(colors.purple)
            .setThumbnail(illustrations.ban)
            .addField(":shield: Moderator", interaction.user.toString())
            .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
            .addField(":hourglass: Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

        utente.send({ embeds: [embed] })
            .catch(() => { })

        userstats.moderation = {
            type: "",
            since: null,
            until: null,
            reason: null,
            moderator: null,
            ticketOpened: false
        }

        let reverseWarns = [...userstats.warns].reverse()
        if (userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")]) {
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unTime = new Date().getTime()
            userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unModerator = interaction.user.id
        }

        updateUser(userstats)
    },
};
