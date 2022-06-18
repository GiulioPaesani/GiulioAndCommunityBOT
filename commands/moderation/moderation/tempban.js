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
    name: "tempban",
    description: "Bannare temporaneamente un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/banmute [user] [time] [reason]",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente da bannare temporaneamente",
                type: "STRING",
                required: true
            },
            {
                name: "time",
                description: "Tempo del ban temporaneo",
                type: "STRING",
                required: true,
            },
            {
                name: "reason",
                description: "Motivazione del ban temporaneo",
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
        let time = interaction.options.getString("time")

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi bannare temporaneamente un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi bannare temporaneamente questo utente", comando)
        }

        time = ms(time)
        if (!time || time < 0) {
            return replyMessage(client, interaction, "Error", "Tempo non valido", "Hai inserito un tempo non valido", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        if (userstats.moderation.type) {
            if (userstats.moderation.type == "Tempbanned") {
                return replyMessage(client, interaction, "Warning", "Utente già tempbannato", "Questo utente è già bannato temporaneamente", comando)
            }

            let embed = new Discord.MessageEmbed()
                .setTitle(userstats.moderation.type == "Muted" ? "Utente mutato" : userstats.moderation.type == "Tempmuted" ? "Utente tempmutato" : userstats.moderation.type == "Banned" ? "Utente bannato" : userstats.moderation.type == "Tempbanned" ? "Utente tempbannato" : userstats.moderation.type == "Forcebanned" ? "Utente forzatamente bannato" : "")
                .setColor(colors.gray)
                .setDescription(`Questo utente è ${userstats.moderation.type == "Muted" ? "mutato" : userstats.moderation.type == "Tempmuted" ? "tempmutato" : userstats.moderation.type == "Banned" ? "bannato" : userstats.moderation.type == "Tempbanned" ? "tempbannato" : userstats.moderation.type == "Forcebanned" ? "forzatamente bannato" : ""}. Vuoi **sovrascrivere** il suo stato di moderazione?`)

            let button1 = new Discord.MessageButton()
                .setLabel("Sovrascrivi moderazione")
                .setStyle("DANGER")
                .setCustomId(`sovrascriviModerazione`)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)

            interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
                .then(msg => {
                    const collector = msg.createMessageComponentCollector();

                    collector.on('collect', i => {
                        if (!i.isButton()) return
                        if (isMaintenance(i.user.id)) return

                        i.deferUpdate().catch(() => { })

                        if (!i.customId.startsWith("sovrascriviModerazione")) return

                        if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                        interaction.guild.channels.cache.forEach((canale) => {
                            if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket &&
                                canale.id != settings.idCanaliServer.rules) {
                                canale.permissionOverwrites?.edit(settings.ruoliModeration.banned, {
                                    VIEW_CHANNEL: false,
                                    SPEAK: false
                                })
                            }
                        })

                        interaction.guild.members.unban(utente.id)
                            .then(() => {
                                embed = new Discord.MessageEmbed()
                                    .setTitle(":name_badge: Unban :name_badge:")
                                    .setColor(colors.purple)
                                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                                    .setThumbnail(interaction.guild.members.cache.get(utente.id).displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                                    .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                                    .addField(":brain: Executor", `${client.user.toString()} - ${client.user.tag}\nID: ${client.user.id}`)
                                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                                    .addField(":page_facing_up: Ban reason", userstats.moderation.reason)
                                    .addField(":hourglass: Time banned", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`)

                                if (!isMaintenance())
                                    client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })

                                let reverseWarns = [...userstats.warns].reverse()
                                userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unTime = new Date().getTime()
                                userstats.warns[userstats.warns.length - 1 - reverseWarns.findIndex(x => x.type == "ban" || x.type == "fban" || x.type == "tempban")].unModerator = interaction.user.id
                            })
                            .catch(() => { })

                        if (interaction.guild.members.cache.get(utente.id)) {
                            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.banned)
                            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.muted)
                            interaction.guild.members.cache.get(utente.id).roles.remove(settings.ruoliModeration.tempmuted)
                            interaction.guild.members.cache.get(utente.id).roles.add(settings.ruoliModeration.tempbanned)
                                .then(() => {
                                    if (interaction.guild.members.cache.get(utente.id).voice?.channelId) {
                                        interaction.guild.members.cache.get(utente.id).voice.disconnect()
                                    }
                                })
                        }
                        else {
                            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.muted)
                            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempmuted)
                            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.banned)
                            userstats.roles.push(settings.ruoliModeration.tempbanned)
                        }

                        userstats.moderation = {
                            type: "Tempbanned",
                            since: new Date().getTime(),
                            until: moment().add(time, "ms").valueOf(),
                            reason: reason,
                            moderator: interaction.user.id,
                            ticketOpened: false
                        }
                        userstats.warns.push({
                            type: "tempban",
                            reason: reason,
                            time: new Date().getTime(),
                            moderator: interaction.user.id,
                            unTime: null,
                            unModerator: null
                        })
                        updateUser(userstats)

                        let embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `[TEMPBAN] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
                            .setThumbnail(illustrations.ban)
                            .setColor(colors.purple)
                            .addField(":page_facing_up: Reason", reason)
                            .addField(":hourglass: Time", ms(time, { long: true }))
                            .addField(":shield: Moderator", interaction.user.toString())
                            .setFooter({ text: "User ID: " + utente.id })

                        msg.edit({ embeds: [embed], components: [] })

                        embed = new Discord.MessageEmbed()
                            .setTitle(":o: Tempban :o:")
                            .setColor(colors.purple)
                            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                            .addField(":hourglass: Duration", `${ms(time, { long: true })} (Until: ${moment().add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`)
                            .addField(":page_facing_up: Reason", reason)

                        if (!isMaintenance())
                            client.channels.cache.get(log.moderation.tempban).send({ embeds: [embed] })

                        embed = new Discord.MessageEmbed()
                            .setTitle("Sei stato bannato temporaneamente")
                            .setColor(colors.purple)
                            .setThumbnail(illustrations.mute)
                            .addField(":page_facing_up: Reason", reason)
                            .addField(":hourglass: Time", ms(time, { long: true }))
                            .addField(":shield: Moderator", interaction.user.toString())

                        utente.send({ embeds: [embed] })
                            .catch(() => { })
                    })
                })
            return
        }

        interaction.guild.channels.cache.forEach((canale) => {
            if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket &&
                canale.id != settings.idCanaliServer.rules) {
                canale.permissionOverwrites?.edit(settings.ruoliModeration.banned, {
                    VIEW_CHANNEL: false,
                    SPEAK: false
                })
            }
        })

        if (interaction.guild.members.cache.get(utente.id)) {
            interaction.guild.members.cache.get(utente.id).roles.add(settings.ruoliModeration.tempbanned)
                .then(() => {
                    if (interaction.guild.members.cache.get(utente.id).voice?.channelId) {
                        interaction.guild.members.cache.get(utente.id).voice.disconnect()
                    }
                })
        }
        else {
            userstats.roles.push(settings.ruoliModeration.tempbanned)
        }

        userstats.moderation = {
            type: "Tempbanned",
            since: new Date().getTime(),
            until: moment().add(time, "ms").valueOf(),
            reason: reason,
            moderator: interaction.user.id,
            ticketOpened: false
        }
        userstats.warns.push({
            type: "tempban",
            reason: reason,
            time: new Date().getTime(),
            moderator: interaction.user.id,
            unTime: null,
            unModerator: null
        })
        updateUser(userstats)

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: `[TEMPBAN] ${interaction.guild.members.cache.get(utente.id)?.nickname || utente.username}`, iconURL: interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(illustrations.ban)
            .setColor(colors.purple)
            .addField(":page_facing_up: Reason", reason)
            .addField(":hourglass: Time", ms(time, { long: true }))
            .addField(":shield: Moderator", interaction.user.toString())
            .setFooter({ text: "User ID: " + utente.id })

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        embed = new Discord.MessageEmbed()
            .setTitle(":o: Tempban :o:")
            .setColor(colors.purple)
            .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
            .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
            .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
            .addField(":hourglass: Duration", `${ms(time, { long: true })} (Until: ${moment().add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`)
            .addField(":page_facing_up: Reason", reason)

        if (!isMaintenance())
            client.channels.cache.get(log.moderation.tempban).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
            .setTitle("Sei stato bannato temporaneamente")
            .setColor(colors.purple)
            .setThumbnail(illustrations.mute)
            .addField(":page_facing_up: Reason", reason)
            .addField(":hourglass: Time", ms(time, { long: true }))
            .addField(":shield: Moderator", interaction.user.toString())

        utente.send({ embeds: [embed] })
            .catch(() => { })
    },
};