const Discord = require("discord.js")
const moment = require("moment")
const ms = require("ms")
const settings = require("../../config/general/settings.json");
const { addUser } = require("../../functions/database/addUser");
const { getUser } = require("../../functions/database/getUser");
const { replyMessage } = require("../../functions/general/replyMessage")
const { getEmoji } = require("../../functions/general/getEmoji");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");

module.exports = {
    name: "infractions",
    description: "Visualizzare tutte le infrazioni e le info di moderazione di un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/infractions (user) (code)",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere le infrazioni",
                type: "STRING",
                required: false
            },
            {
                name: "code",
                description: "Codice dell'infranzione da vedere approfondita",
                type: "INTEGER",
                minValue: 1,
                required: false
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi vedere le infrazioni di un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let warns = userstats.warns;

        let code = interaction.options.getInteger("code")
        if (!code) {

            let embed = new Discord.MessageEmbed()
                .setTitle(`Infractions - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))

            if (userstats.moderation.type) {
                embed
                    .setDescription(userstats.moderation.type == "Muted" ? ":mute: User **muted**" : userstats.moderation.type == "Tempmuted" ? ":mute: User **tempmuted**" : userstats.moderation.type == "Banned" ? ":no_entry: User **banned**" : userstats.moderation.type == "Tempbanned" ? ":no_entry: User **tempbanned**" : userstats.moderation.type == "Forcebanned" ? ":name_badge: User **Forcebanned**" : "")
                    .addField(":page_facing_up: Reason", userstats.moderation.reason, true)
                    .addField(":shield: Moderator", userstats.moderation.moderator ? client.users.cache.get(userstats.moderation.moderator).toString() : client.user.toString(), true)
                    .addField(":alarm_clock: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)

                if (userstats.moderation.until)
                    embed
                        .addField(":hourglass: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})`)
            }

            let warnsList = ""
            let totPage = Math.ceil(warns.length / 10);
            let page = 1;

            if (warns.length == 0) warnsList = "Nessuna infranzione"
            else {
                for (let i = 10 * (page - 1); i < 10 * page; i++) {
                    if (warns[i]) {
                        warnsList += `**#${i + 1}**${warns[i].type == "mute" ? " **[Mute]**" : warns[i].type == "tempmute" ? " **[Tempmute]**" : warns[i].type == "ban" ? " **[Ban]**" : warns[i].type == "tempban" ? " **[Tempban]**" : warns[i].type == "fban" ? " **[Forceban]**" : warns[i].type == "kick" ? " **[Kick]**" : ""} ${warns[i].reason} (${moment(warns[i].time).fromNow()})\n`
                    }
                }
            }

            embed
                .addField(`:warning: ${warns.length} warns`, warnsList)
                .setFooter({ text: warns.length > 10 ? `Page ${page}/${totPage}` : "" })

            let button1 = new Discord.MessageButton()
                .setCustomId(`indietroInfractions,${interaction.user.id},${page},${utente.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Previous"))

            if (page == 1) button1.setDisabled()

            let button2 = new Discord.MessageButton()
                .setCustomId(`avantiInfractions,${interaction.user.id},${page},${utente.id}`)
                .setStyle("PRIMARY")
                .setEmoji(getEmoji(client, "Next"))

            if (page == totPage) button2.setDisabled()

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: warns.length > 10 ? [row] : [] })
        }
        else {
            if (code && !warns[code - 1]) {
                return replyMessage(client, interaction, "Error", "Codice non valido", "Il codice che hai inserito non corrisponde a nessuna infranzione", comando)
            }

            let warn = warns[code - 1]

            let embed = new Discord.MessageEmbed()
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .setTitle(`Infraction #${code}${warn.type == "mute" ? " [Mute]" : warn.type == "tempmute" ? " [Tempmute]" : warn.type == "ban" ? " [Ban]" : warn.type == "tempban" ? " [Tempban]" : warn.type == "fban" ? " [Forceban]" : warn.type == "kick" ? " [Kick]" : ""} - ${interaction.guild.members.cache.get(utente.id)?.nickname ? interaction.guild.members.cache.get(utente.id).nickname : utente.username}`)
                .addField(":alarm_clock: Time", `${moment(warn.time).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(warn.time).fromNow()})`)

            if (warn.type == "warn") {
                embed
                    .addField(":page_facing_up: Reason", warn.reason || "_Nessuna reason_", true)
                    .addField(":shield: Moderator", `<@${warn.moderator}>`, true)
            }
            else {
                embed
                    .addField(":page_facing_up: Reason", warn.reason || "_Nessuna reason_", true)
                    .addField(":shield: Moderator", `<@${warn.moderator}>`, true)

                if ((warn.type == "mute" || warn.type == "tempmute") && warn.unTime) {
                    embed
                        .addField(":anger: Unmuted", `${moment(warn.unTime).format("ddd DD MMM YYYY, HH:mm")} (after ${ms(warn.unTime - warn.time, { long: true })}) from <@${warn.unModerator}>`)
                }
                else if ((warn.type == "ban" || warn.type == "tempban" || warn.type == "fban") && warn.unTime) {
                    embed
                        .addField(":anger: Unbanned", `${moment(warn.unTime).format("ddd DD MMM YYYY, HH:mm")} (after ${ms(warn.unTime - warn.time, { long: true })}) from <@${warn.unModerator}>`)
                }
            }

            interaction.reply({ embeds: [embed] })
        }
    },
};