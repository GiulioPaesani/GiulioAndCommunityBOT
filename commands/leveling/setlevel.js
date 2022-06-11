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
const { getXpNecessari } = require("../../functions/leveling/getXpNecessari")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

module.exports = {
    name: "setlevel",
    description: "Modificare il livello di un utente",
    permissionLevel: 2,
    requiredLevel: 0,
    syntax: "/setlevel [remove/set/add] [user] [levels]",
    category: "ranking",
    client: "ranking",
    data: {
        options: [
            {
                name: "remove",
                description: "Rimuovi livelli a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi rimuovere i livelli",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "levels",
                        description: "Livelli da rimuovere",
                        type: "INTEGER",
                        minValue: 1,
                        required: true
                    }
                ]
            },
            {
                name: "set",
                description: "Settare livelli a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi settare i livelli",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "levels",
                        description: "Livelli da settare",
                        type: "INTEGER",
                        minValue: 0,
                        required: true
                    }
                ]
            },
            {
                name: "add",
                description: "Aggiungere livelli a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi aggiungere i livelli",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "levels",
                        description: "Livelli da aggiungere",
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
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare i livelli a questo utente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non a un bot", "Non puoi modificare i livelli a un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let levels = interaction.options.getInteger("levels")

        if (interaction.options.getSubcommand() == "remove") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Remove levels :outbox_tray:")
                .setColor(colors.red)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Levels removed", `-${levels}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            if (userstats.leveling.level < levels) levels = userstats.leveling.level
            userstats.leveling.xp = getXpNecessari(userstats.leveling.level - levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli rimossi", `**${levels} livelli** rimossi a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
        else if (interaction.options.getSubcommand() == "add") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Add levels :inbox_tray:")
                .setColor(colors.green)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Levels added", `+${levels}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            userstats.leveling.xp = getXpNecessari(userstats.leveling.level + levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli aggiunti", `**${levels} livelli** aggiunti a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
        else if (interaction.options.getSubcommand() == "set") {
            let embed = new Discord.MessageEmbed()
                .setTitle(":paintbrush: Set levels :paintbrush:")
                .setColor(colors.yellow)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
                .addField(":brain: Executor", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
                .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`)
                .addField(":beginner: Levels setted", `${levels}`)
                .addField(":fleur_de_lis: User level", `
Old: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})
`)

            userstats.leveling.xp = getXpNecessari(levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli settati", `**${levels} livelli** settati a ${utente.toString()}`)

            embed.fields[4].value += `New: Lvl. ${userstats.leveling.level} (XP: ${humanize(userstats.leveling.xp)})`

            if (!isMaintenance())
                client.channels.cache.get(log.ranking.editLevel).send({ embeds: [embed] })
        }
    },
};