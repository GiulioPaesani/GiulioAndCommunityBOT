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
                        required: true
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
                        required: true
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
                        required: true
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

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        let levels = interaction.options.getInteger("levels")

        if (interaction.options.getSubcommand() == "remove") {
            if (userstats.leveling.level < levels) levels = userstats.leveling.level
            userstats.leveling.xp = getXpNecessari(userstats.leveling.level - levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli rimossi", `**${levels} livelli** rimossi a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "add") {
            userstats.leveling.xp = getXpNecessari(userstats.leveling.level + levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli aggiunti", `**${levels} livelli** aggiunti a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "set") {
            userstats.leveling.xp = getXpNecessari(levels)
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Livelli settati", `**${levels} livelli** settati a ${utente.toString()}`)
        }
    },
};