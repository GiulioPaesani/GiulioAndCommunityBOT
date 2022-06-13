const Discord = require("discord.js")
const moment = require("moment")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")
const { updateUser } = require("../../../functions/database/updateUser")
const { getUser } = require("../../../functions/database/getUser")
const { addUser } = require("../../../functions/database/addUser")

module.exports = {
    name: "kick",
    description: "Kickare un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/kick [user] [reason]",
    category: "moderation",
    client: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da kickare",
                type: "STRING",
                required: true,
                autocomplete: true
            },
            {
                name: "reason",
                description: "Motivazione del kick",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"), true)
        let reason = interaction.options.getString("reason")

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi kickare un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi kickare questo utente", comando)
        }

        if (interaction.guild.members.cache.get(utente.id) && !interaction.guild.members.cache.get(utente.id).kickable) {
            return replyMessage(client, interaction, "NonHoPermesso", "", "Non ho il permesso di kickare questo utente", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[KICK] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(illustrations.kick)
            .setColor(colors.purple)
            .addField(":page_facing_up: Reason", reason)
            .addField(":shield: Moderator", interaction.user.toString())
            .setFooter({ text: "User ID: " + utente.id })

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        embed = new Discord.MessageEmbed()
            .setTitle(":ping_pong: Kick :ping_pong:")
            .setColor(colors.purple)
            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
            .addField(":page_facing_up: Reason", reason)

        if (!isMaintenance())
            client.channels.cache.get(log.moderation.kick).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
            .setTitle("Sei stato espulso")
            .setColor(colors.purple)
            .setThumbnail(illustrations.kick)
            .addField(":page_facing_up: Reason", reason)
            .addField(":shield: Moderator", interaction.user.toString())

        await utente.send({ embeds: [embed] })
            .catch(() => { })

        interaction.guild.members.cache.get(utente.id)?.kick({ reason: reason })

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        userstats.warns.push({
            type: "kick",
            reason: reason,
            time: new Date().getTime(),
            moderator: interaction.user.id
        })

        updateUser(userstats)
    },
};