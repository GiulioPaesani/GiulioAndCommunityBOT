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
    name: "unmute",
    description: "Smutare un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/unmute [user]",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da smutare",
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
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi smutare un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi smutare questo utente", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        if (userstats.moderation.type != "Muted" && userstats.moderation.type != "Tempmuted") {
            return replyMessage(client, interaction, "Warning", "Utente non mutato", "Questo utente non è mutato", comando)
        }

        if (interaction.guild.members.cache.get(utente.id)) {
            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.muted)
            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.tempmuted)
                .then(() => {
                    if (interaction.guild.members.cache.get(utente.id).voice?.channelId) {
                        let canale = interaction.guild.members.cache.get(utente.id).voice.channelId
                        if (canale == settings.idCanaliServer.general1)
                            interaction.guild.members.cache.get(utente.id).voice.setChannel(settings.idCanaliServer.general2)
                        else
                            interaction.guild.members.cache.get(utente.id).voice.setChannel(settings.idCanaliServer.general1)
                        interaction.guild.members.cache.get(utente.id).voice.setChannel(canale)
                    }
                })
        }
        else {
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.muted)
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempmuted)
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[UNMUTE] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(illustrations.mute)
            .setColor(colors.purple)
            .addField(":shield: Moderator", interaction.user.toString())
            .addField(":page_facing_up: Mute reason", userstats.moderation.reason)
            .addField(":hourglass: Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
            .setFooter({ text: "User ID: " + utente.id })

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        embed = new Discord.MessageEmbed()
            .setTitle(":loud_sound: Unmute :loud_sound:")
            .setColor(colors.purple)
            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
            .addField(":page_facing_up: Mute reason", userstats.moderation.reason)
            .addField(":hourglass: Time muted", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`)

        if (!isMaintenance())
            client.channels.cache.get(log.moderation.unmute).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
            .setTitle("Sei stato smutato")
            .setColor(colors.purple)
            .setThumbnail(illustrations.mute)
            .addField(":shield: Moderator", interaction.user.toString())
            .addField(":page_facing_up: Mute reason", userstats.moderation.reason)
            .addField(":hourglass: Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

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
        userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "mute" || x.type == "tempmute")].unTime = new Date().getTime()
        userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "mute" || x.type == "tempmute")].unModerator = interaction.user.id

        updateUser(userstats)
    },
};