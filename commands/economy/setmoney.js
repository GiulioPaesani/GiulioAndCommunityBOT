const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { humanize } = require("../../functions/general/humanize")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { updateUser } = require("../../functions/database/updateUser")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

module.exports = {
    name: "setmoney",
    description: "Modificare le monete di un utente",
    permissionLevel: 2,
    requiredLevel: 0,
    syntax: "/setmoney [remove/set/add] [user] [coins]",
    category: "ranking",
    data: {
        options: [
            {
                name: "remove",
                description: "Rimuovi monete a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi rimuovere le monete",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "coins",
                        description: "Monete da rimuovere",
                        type: "INTEGER",
                        minValue: 1,
                        required: true
                    }
                ]
            },
            {
                name: "set",
                description: "Settare monete a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi settare le monete",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "coins",
                        description: "Monete da settare",
                        type: "INTEGER",
                        minValue: 0,
                        required: true
                    }
                ]
            },
            {
                name: "add",
                description: "Aggiungere monete a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi aggiungere le monete",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "coins",
                        description: "Monete da aggiungere",
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
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare le monete a questo utente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non a un bot", "Non puoi modificare le monete a un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let coins = interaction.options.getInteger("coins")

        if (interaction.options.getSubcommand() == "remove") {
            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Monete rimosse", `**${coins} monete** rimosse a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "add") {
            userstats.economy.money += coins

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Monete aggiunte", `**${coins} monete** aggiunte a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "set") {
            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Monete settate", `**${coins} monete** settate a ${utente.toString()}`)
        }
    },
};