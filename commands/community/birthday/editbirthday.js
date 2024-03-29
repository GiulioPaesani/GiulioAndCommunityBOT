const moment = require("moment")
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { updateUser } = require("../../../functions/database/updateUser");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { getTaggedUser } = require("../../../functions/general/getTaggedUser");

module.exports = {
    name: "editbirthday",
    description: "Modificare il compleanno di un utente",
    permissionLevel: 2,
    requiredLevel: 0,
    cooldown: 5,
    syntax: "/editbirthday [set/reset] [user] [month] [day]",
    category: "community",
    data: {
        options: [
            {
                name: "reset",
                description: "Resettare il compleanno di un utente",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "Utente di cui resettare il compleanno",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "set",
                description: "Settare il compleanno di un utente",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "Utente di cui settare il compleanno",
                        type: "STRING",
                        required: true,
                    },
                    {
                        name: "month",
                        description: "Mese del compleanno",
                        type: "STRING",
                        choices: [
                            {
                                name: "Gennaio",
                                value: "Gennaio"
                            },
                            {
                                name: "Febbraio",
                                value: "Febbraio"
                            },
                            {
                                name: "Marzo",
                                value: "Marzo",
                            },
                            {
                                name: "Aprile",
                                value: "Aprile"
                            },
                            {
                                name: "Maggio",
                                value: "Maggio"
                            },
                            {
                                name: "Giugno",
                                value: "Giugno"
                            },
                            {
                                name: "Luglio",
                                value: "Luglio"
                            },
                            {
                                name: "Agosto",
                                value: "Agosto"
                            },
                            {
                                name: "Settembre",
                                value: "Settembre"
                            },
                            {
                                name: "Ottobre",
                                value: "Ottobre"
                            },
                            {
                                name: "Novembre",
                                value: "Novembre"
                            },
                            {
                                name: "Dicembre",
                                value: "Dicembre"
                            }
                        ],
                        required: true
                    },
                    {
                        name: "day",
                        description: "Giorno del compleanno",
                        type: "INTEGER",
                        minValue: 1,
                        maxValue: 31,
                        required: true
                    }
                ]
            }
        ],
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user"))

        if (!utente) {
            return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
        }

        if (getUserPermissionLevel(client, utente.id) >= getUserPermissionLevel(client, interaction.user.id) && getUserPermissionLevel(client, interaction.user.id) < 3) {
            return replyMessage(client, interaction, "NonPermesso", "", "Non puoi modificare il compleanno a questo utente", comando)
        }

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non a un bot", "Non puoi modificare il compleanno a un bot", comando)
        }

        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        if (interaction.options.getSubcommand() == "set") {
            let month
            switch (interaction.options.getString("month")) {
                case "Gennaio": month = 1; break
                case "Febbraio": month = 2; break
                case "Marzo": month = 3; break
                case "Aprile": month = 4; break
                case "Maggio": month = 5; break
                case "Giugno": month = 6; break
                case "Luglio": month = 7; break
                case "Agosto": month = 8; break
                case "Settembre": month = 9; break
                case "Ottobre": month = 10; break
                case "Novembre": month = 11; break
                case "Dicembre": month = 12; break
            }

            let day = interaction.options.getInteger("day")

            if (!moment([2020, month - 1, day]).isValid() || (!moment([2020, month - 1, day]).isValid() && moment([2021, month - 1, day]).isValid())) {
                return replyMessage(client, interaction, "Error", "Inserire una data valida", "Scrivi la data valida del tuo compleanno", comando)
            }

            userstats.birthday = [month, day]
            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Compleanno settato", `Il giorno di compleanno di ${utente.toString()} è stato settato il giorno **${day} ${moment().set("month", month - 1).format("MMMM")}**`)
        }
        else if (interaction.options.getSubcommand() == "reset") {
            if (!userstats.birthday || !userstats.birthday[0]) {
                return replyMessage(client, interaction, "Warning", "Compleanno non esistente", "Questo utente non ha inserito il proprio compleanno", comando)
            }

            userstats.birthday = []
            updateUser(userstats)

            replyMessage(client, interaction, "Correct", "Compleanno resettato", `Il giorno di compleanno di ${utente.toString()} è stato resettato`)
        }
    },
};