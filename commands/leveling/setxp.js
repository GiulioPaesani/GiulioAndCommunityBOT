const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { checkLevelUp } = require("../../functions/leveling/checkLevelUp");
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { humanize } = require("../../functions/general/humanize")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { updateUser } = require("../../functions/database/updateUser")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

module.exports = {
    name: "setxp",
    description: "Modificare i punti esperienza di un utente",
    permissionLevel: 2,
    requiredLevel: 0,
    syntax: "/setxp [remove/set/add] [user] [xp]",
    category: "ranking",
    client: "ranking",
    data: {
        options: [
            {
                name: "remove",
                description: "Rimuovi xp a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi rimuovere l'xp",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "xp",
                        description: "Punti xp da rimuovere",
                        type: "INTEGER",
                        minValue: 1,
                        required: true
                    }
                ]
            },
            {
                name: "set",
                description: "Settare xp a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi settare l'xp",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "xp",
                        description: "Punti xp da settare",
                        type: "INTEGER",
                        minValue: 0,
                        required: true
                    }
                ]
            },
            {
                name: "add",
                description: "Aggiungere xp a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi aggiungere l'xp",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "xp",
                        description: "Punti xp da aggiungere",
                        type: "INTEGER",
                        minValue: 1,
                        required: true
                    }
                ]
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare i punti esperienza a questo utente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non a un bot", "modificare i punti esperienza a un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let xp = interaction.options.getInteger("xp")

        if (interaction.options.getSubcommand() == "remove") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Remove xp :outbox_tray:")
                .setColor(colors.red)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Xp removed", `-${xp}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            if (userstats.leveling.xp < xp) xp = userstats.leveling.xp
            userstats.leveling.xp -= xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp rimossi", `**${xp} punti esperienza** rimossi a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
        else if (interaction.options.getSubcommand() == "add") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Add xp :inbox_tray:")
                .setColor(colors.green)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Xp added", `+${xp}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            userstats.leveling.xp += xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp aggiunti", `**${xp} punti esperienza** aggiunti a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
        else if (interaction.options.getSubcommand() == "set") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":paintbrush: Set xp :paintbrush:")
                .setColor(colors.yellow)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Xp setted", `${xp}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            userstats.leveling.xp = xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp settati", `**${xp} punti esperienza** settati a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
    },
};