const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const log = require("../../config/general/log.json");
const { addUser } = require("../../functions/database/addUser");
const { getUser } = require("../../functions/database/getUser");
const { replyMessage } = require("../../functions/general/replyMessage")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { updateUser } = require("../../functions/database/updateUser");
const { getTaggedUser } = require("../../functions/general/getTaggedUser");
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: "clearinfractions",
    description: "Eliminare le infranzioni di un utente",
    permissionLevel: 1,
    requiredLevel: 0,
    syntax: "/clearinfractions [user] (code)",
    category: "moderation",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui eliminare le infrazioni",
                type: "STRING",
                required: true
            },
            {
                name: "code",
                description: "Codice dell'infranzione da eliminare",
                type: "INTEGER",
                minValue: 1,
                required: false
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi eliminare le infrazioni di un bot", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi eliminare le infranzioni a questo utente", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let warns = userstats.warns;

        if (warns.length == 0) {
            return replyMessage(client, interaction, "Warning", "Utente senza infranzioni", "Questo utente non ha nessuna infranzione", comando)
        }

        let code = interaction.options.getInteger("code")
        if (code && !warns[code - 1]) {
            return replyMessage(client, interaction, "Error", "Codice non valido", "Questo codice non corrisponde a una infranzione dell'utente", comando)
        }

        let warnsList = ""
        let warnsDeletedList = ""
        if (!code) {
            for (let i = 0; i < 10; i++) {
                if (warns[i]) {
                    warnsList += `**#${i + 1}**${warns[i].type == "mute" ? " **[Mute]**" : warns[i].type == "tempmute" ? " **[Tempmute]**" : warns[i].type == "ban" ? " **[Ban]**" : warns[i].type == "tempban" ? " **[Tempban]**" : warns[i].type == "fban" ? " **[Forceban]**" : warns[i].type == "kick" ? " **[Kick]**" : ""} ${warns[i].reason}\n`
                    warnsDeletedList += `- ${warns[i].type == "mute" ? " **[Mute]**" : warns[i].type == "tempmute" ? " **[Tempmute]**" : warns[i].type == "ban" ? " **[Ban]**" : warns[i].type == "tempban" ? " **[Tempban]**" : warns[i].type == "fban" ? " **[Forceban]**" : warns[i].type == "kick" ? " **[Kick]**" : ""} ${warns[i].reason}\n`
                }

                if (i == 9 && warns.length > 10) {
                    warnsList += `Altri ${warns.length - 10} warns...`
                    warnsDeletedList += `Altri ${warns.length - 10} warns...`
                    break
                }
            }

            let embed = new Discord.MessageEmbed()
                .setTitle("Tutte le infrazioni eliminate")
                .setColor(colors.blue)
                .setDescription(`Sono state eliminate tutte le **${warns.length} infrazioni** di ${utente.toString()}`)
                .addField(`:warning: ${warns.length} warns deleted`, warnsList)

            let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

            userstats.warns = []
            updateUser(userstats)

            embed = new Discord.MessageEmbed()
                .setTitle(":fire_extinguisher: Clear infractions :fire_extinguisher:")
                .setColor(colors.purple)
                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                .addField(":wastebasket: Warns deleted", warnsDeletedList)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.clearinfractions).send({ embeds: [embed] })
        }
        else {
            warnsList += `**#${code}**${warns[code - 1].type == "mute" ? " **[Mute]**" : warns[code - 1].type == "tempmute" ? " **[Tempmute]**" : warns[code - 1].type == "ban" ? " **[Ban]**" : warns[code - 1].type == "tempban" ? " **[Tempban]**" : warns[code - 1].type == "fban" ? " **[Forceban]**" : warns[code - 1].type == "kick" ? " **[Kick]**" : ""} ${warns[code - 1].reason}\n`
            warnsDeletedList += `-${warns[code - 1].type == "mute" ? " **[Mute]**" : warns[code - 1].type == "tempmute" ? " **[Tempmute]**" : warns[code - 1].type == "ban" ? " **[Ban]**" : warns[code - 1].type == "tempban" ? " **[Tempban]**" : warns[code - 1].type == "fban" ? " **[Forceban]**" : warns[code - 1].type == "kick" ? " **[Kick]**" : ""} ${warns[code - 1].reason}\n`

            let embed = new Discord.MessageEmbed()
                .setTitle("Infranzione eliminata")
                .setColor(colors.blue)
                .setDescription(`Infrazioni di ${utente.toString()} eliminata`)
                .addField(":warning: 1 warn deleted", warnsDeletedList)

            let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

            userstats.warns = []
            for (let i = 0; i < warns.length; i++) {
                if (i != code - 1) userstats.warns.push(warns[i])
            }
            updateUser(userstats)

            embed = new Discord.MessageEmbed()
                .setTitle(":fire_extinguisher: Clear infractions :fire_extinguisher:")
                .setColor(colors.purple)
                .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                .setThumbnail(interaction.guild.members.cache.get(utente.id)?.displayAvatarURL({ dynamic: true }) || utente.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ${interaction.user.tag}\nID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ${utente.tag}\nID: ${utente.id}`)
                .addField(":wastebasket: Warns deleted", warnsList)

            if (!isMaintenance())
                client.channels.cache.get(log.moderation.clearinfractions).send({ embeds: [embed] })
        }
    },
};