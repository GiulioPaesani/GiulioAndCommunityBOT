const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { checkLevelUp } = require("../../functions/leveling/checkLevelUp");
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
                        required: true
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

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        let xp = interaction.options.getInteger("xp")

        if (interaction.options.getSubcommand() == "remove") {
            if (userstats.leveling.xp < xp) xp = userstats.leveling.xp
            userstats.leveling.xp -= xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp rimossi", `**${xp} punti esperienza** rimossi a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "add") {
            userstats.leveling.xp += xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp aggiunti", `**${xp} punti esperienza** aggiunti a ${utente.toString()}`)
        }
        else if (interaction.options.getSubcommand() == "set") {
            userstats.leveling.xp = xp
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Xp settati", `**${xp} punti esperienza** settati a ${utente.toString()}`)
        }
    },
};