const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const settings = require("../../../config/general/settings.json")
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const illustrations = require("../../../config/general/illustrations.json")
const { replyMessage } = require("../../../functions/general/replyMessage")
const { getUser } = require("../../../functions/database/getUser")
const { addUser } = require("../../../functions/database/addUser");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { updateUser } = require("../../../functions/database/updateUser");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getTaggedUser } = require("../../../functions/general/getTaggedUser")

module.exports = {
    name: "warn",
    description: "Aggiungere un infranzione a un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/warn [user] [reason]",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da warnare",
                type: "STRING",
                required: true
            },
            {
                name: "reason",
                description: "Testo dell'infranzione",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))
        let reason = interaction.options.getString("reason")

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi warnare un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi warnare questo utente", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        userstats.warns.push({
            type: "warn",
            reason: reason,
            time: new Date().getTime(),
            moderator: interaction.user.id
        })
        updateUser(userstats)

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[WARN] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(illustrations.warn)
            .setColor(colors.purple)
            .addField(":page_facing_up: Reason", reason)
            .addField(":shield: Moderator", interaction.user.toString())
            .setFooter({ text: "User ID: " + utente.id })

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        embed = new Discord.MessageEmbed()
            .setTitle(":trident: Warn :trident:")
            .setColor(colors.purple)
            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
            .addField(":page_facing_up: Reason", reason)

        if (!isMaintenance())
            client.channels.cache.get(log.moderation.warn).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
            .setTitle("Sei stato warnato")
            .setColor(colors.purple)
            .setThumbnail(illustrations.warn)
            .addField(":page_facing_up: Reason", reason)
            .addField(":shield: Moderator", interaction.user.toString())

        utente.send({ embeds: [embed] })
            .catch(() => { })

        if (userstats.warns.filter(x => new Date().getTime() - x.time < 604800000 && x.type == "warn").length >= 3 && !getUserPermissionLevel(client, utente.id)) {
            interaction.guild.channels.cache.forEach((canale) => {
                if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket) {
                    canale.permissionOverwrites?.edit(settings.ruoliModeration.tempmuted, {
                        SEND_MESSAGES: false,
                        SEND_MESSAGES_IN_THREADS: false,
                        ADD_REACTIONS: false,
                        SPEAK: false,
                        STREAM: false,
                    })
                }
            })

            if (interaction.guild.members.cache.get(utente.id)) {
                interaction.guild.members.cache.get(utente.id).roles.add(settings.ruoliModeration.tempmuted)
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
                userstats.roles.push(settings.ruoliModeration.tempmuted)
            }

            let time = 259200000;
            let reason = "5 warn in una settimana";

            userstats.moderation = {
                type: "Tempmuted",
                since: new Date().getTime(),
                until: moment().add(time, "ms").valueOf(),
                reason: reason,
                moderator: client.user.id,
                ticketOpened: false
            }
            userstats.warns.push({
                type: "tempmute",
                reason: reason,
                time: new Date().getTime(),
                moderator: client.user.id,
                unTime: null,
                unModerator: null
            })
            updateUser(userstats)

            let embed = new Discord.MessageEmbed()
                .setAuthor({ name: `[TEMPMUTE] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(illustrations.mute)
                .setColor(colors.purple)
                .addField(":page_facing_up: Reason", reason)
                .addField(":hourglass: Time", ms(time, { long: true }))
                .setFooter({ text: "User ID: " + utente.id })

            let msg = await interaction.channel.send({ embeds: [embed], fetchReply: true })

            embed = new Discord.MessageEmbed()
                .setTitle(":speaker: Tempmute :speaker:")
                .setColor(colors.purple)
                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                .addField(":hourglass: Duration", `${ms(time, { long: true })} (Until: ${moment().add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`)
                .addField(":page_facing_up: Reason", reason)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.tempmute).send({ embeds: [embed] })

            embed = new Discord.MessageEmbed()
                .setTitle("Sei stato mutato temporaneamente")
                .setColor(colors.purple)
                .setThumbnail(illustrations.mute)
                .addField(":page_facing_up: Reason", reason)
                .addField(":hourglass: Time", ms(time, { long: true }))

            utente.send({ embeds: [embed] })
                .catch(() => { })
        }
    },
};