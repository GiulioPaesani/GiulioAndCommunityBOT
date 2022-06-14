const Discord = require("discord.js")
const moment = require("moment")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const log = require("../../config/general/log.json")
const items = require("../../config/ranking/items.json")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { humanize } = require("../../functions/general/humanize")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { updateUser } = require("../../functions/database/updateUser")
const { replyMessage } = require("../../functions/general/replyMessage")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "setitem",
    description: "Modificare le monete di un utente",
    permissionLevel: 2,
    requiredLevel: 0,
    syntax: "/setitem [remove/set/add] [user] [item] [quantity]",
    category: "ranking",
    client: "ranking",
    data: {
        options: [
            {
                name: "remove",
                description: "Rimuovi oggetti a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi rimuovere gli oggetti",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "item",
                        description: "Oggetto da rimuovere",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "quantity",
                        description: "Quantità di oggetti da rimuovere",
                        type: "INTEGER",
                        minValue: 1,
                        required: true,
                    }
                ]
            },
            {
                name: "set",
                description: "Settare oggetti a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi settare gli oggetti",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "item",
                        description: "Oggetto da settare",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "quantity",
                        description: "Quantità di oggetti da settare",
                        type: "INTEGER",
                        minValue: 0,
                        required: true
                    }
                ]
            },
            {
                name: "add",
                description: "Aggiungere oggetti a un utente",
                type: "SUB_COMMAND",
                required: false,
                options: [
                    {
                        name: "user",
                        description: "Utente a cui vuoi aggiungere gli oggetti",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "item",
                        description: "Oggetto da aggiungere",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: "quantity",
                        description: "Quantità di oggetti da aggiungere",
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
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare gli oggetti a questo utente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non a un bot", "Non puoi modificare gli oggetti a un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let item = interaction.options.getString("item")
        let quantity = interaction.options.getInteger("quantity")

        item = items.find(x => x.name.toLowerCase() == item.toLowerCase() || x.id == item.toLowerCase() || x.id == item.toLowerCase().slice(1) || x.alias.includes(item.toLowerCase()))

        if (!item) {
            return replyMessage(client, interaction, "Error", "Oggetto non trovato", "Inserisci un oggetto valido", comando)
        }

        if (interaction.options.getSubcommand() == "remove") {
            userstats.economy.inventory[item.id] = (userstats.economy.inventory[item.id] || 0) - quantity
            if (userstats.economy.inventory[item.id] < 0) userstats.economy.inventory[item.id] = 0

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Oggetti rimossi", `**${quantity} ${getEmoji(client, item.name.toLowerCase())} ${item.name}** rimossi da ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "add") {
            userstats.economy.inventory[item.id] = (userstats.economy.inventory[item.id] || 0) + quantity

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Oggetti aggiunti", `**${quantity} ${getEmoji(client, item.name.toLowerCase())} ${item.name}** aggiunti a ${utente.toString()}`)

        }
        else if (interaction.options.getSubcommand() == "set") {
            userstats.economy.inventory[item.id]
            userstats.economy.inventory[item.id] = quantity

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Oggetti settati", `**${quantity} ${getEmoji(client, item.name.toLowerCase())} ${item.name}** settati a ${utente.toString()}`)
        }
    },
};