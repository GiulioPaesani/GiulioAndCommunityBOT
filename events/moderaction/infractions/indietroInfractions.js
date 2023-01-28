const Discord = require("discord.js")
const moment = require("moment")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("indietroInfractions")) return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstats = await getUser(interaction.customId.split(",")[3])
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(interaction.customId.split(",")[3]) || client.users.cache.get(interaction.customId.split(",")[3]))

        let warns = userstats.warns

        let utente = client.users.cache.get(interaction.customId.split(",")[3])

        let totPage = Math.ceil(warns.length / 10)
        let page = parseInt(interaction.customId.split(",")[2]) - 1;
        if (page < 1) return

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

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};