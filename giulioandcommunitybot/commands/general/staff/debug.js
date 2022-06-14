const Discord = require("discord.js")
const fetch = require("node-fetch")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { getServer } = require("../../../functions/database/getServer");
const { replyMessage } = require("../../../functions/general/replyMessage")
const { updateServer } = require("../../../functions/database/updateServer");
const { getTaggedUser } = require("../../../functions/general/getTaggedUser");
const { getServerStats } = require("../../../functions/database/getServerStats");
const { getUser } = require("../../../functions/database/getUser");
const { getUserStats } = require("../../../functions/database/getUserStats");
const { deleteUser } = require("../../../functions/database/deleteUser");

module.exports = {
    name: "debug",
    description: "Comando con diverse opzioni di debug",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/debug [reload/maintenance/tester/restart/stop]",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "reload",
                description: "Ricaricare un comando esistente",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "command",
                        description: "Nome del comando da ricaricare",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "maintenance",
                description: "Modificare lo stato di manutenzione",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "where",
                        description: "Dove settare lo stato di manutenzione",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "Local",
                                value: "local"
                            },
                            {
                                name: "Host",
                                value: "host"
                            }
                        ]
                    },
                    {
                        name: "mode",
                        description: "Modalità di manutenzione",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "🟢 OFF - Maintenance disabled",
                                value: "0"
                            },
                            {
                                name: "Mode 1 - Only tester can use bot",
                                value: "1"
                            },
                            {
                                name: "Mode 2 - Nobody can use bot",
                                value: "2"
                            },
                            {
                                name: "Mode 2 - Everyone, except testers, can use bot",
                                value: "3"
                            }
                        ]
                    }
                ]
            },
            {
                name: "tester",
                description: "Aggiungere o rimuovere un utente dai tester",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "mode",
                        description: "Scegliere se si vuole aggiungere o rimuovere l'utente",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "🟢 Add",
                                value: "add"
                            },
                            {
                                name: "🔴 Remove",
                                value: "remove"
                            }
                        ]
                    },
                    {
                        name: "user",
                        description: "L'utente da aggiungere o rimuovere dai tester",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "server",
                description: "Ottenere il file del database relativo al server",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "type",
                        description: "Scegliere quale file si vuole ottenere",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "👥 Server",
                                value: "server"
                            },
                            {
                                name: "📊 Serverstats",
                                value: "serverstats"
                            }
                        ]
                    }
                ]
            },
            {
                name: "user",
                description: "Gestire il file del database relativo a un utente",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utente a cui si vuole accedere",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "Scegliere quale file si vuole gestire",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "👤 User",
                                value: "user"
                            },
                            {
                                name: "📊 Userstats",
                                value: "userstats"
                            }
                        ]
                    },
                    {
                        name: "mode",
                        description: "La modalità di gestione del file dell'utente",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "📩 Get",
                                value: "get"
                            },
                            {
                                name: "🗑️ Delete",
                                value: "delete"
                            }
                        ]
                    }
                ]
            },
        ]
    },
    otherGuild: true,
    channelsGranted: [],
    async execute(client, interaction, comando) {
        if (interaction.options.getSubcommand() == "reload") {
            let funCommands = await fetch("http://localhost:2000/client", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": String(process.env.apiKey)
                }
            }).catch(() => { })

            if (funCommands) {
                funCommands = await funCommands.text()
                funCommands = JSON.parse(funCommands).commands
            }
            else funCommands = []

            let moderactionCommands = await fetch("http://localhost:3000/client", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": String(process.env.apiKey)
                }
            }).catch(() => { })

            if (moderactionCommands) {
                moderactionCommands = await moderactionCommands.text()
                moderactionCommands = JSON.parse(moderactionCommands).commands
            }
            else moderactionCommands = []

            let rankingCommands = await fetch("http://localhost:4000/client", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": String(process.env.apiKey)
                }
            }).catch(() => { })

            if (rankingCommands) {
                rankingCommands = await rankingCommands.text()
                rankingCommands = JSON.parse(rankingCommands).commands
            }
            else rankingCommands = []

            let command = client.commands.get(interaction.options.getString("command")) || funCommands.find(x => x.name == interaction.options.getString("command")) || moderactionCommands.find(x => x.name == interaction.options.getString("command")) || rankingCommands.find(x => x.name == interaction.options.getString("command"))

            if (!command) {
                return replyMessage(client, interaction, "Error", "Comando non trovato", "Inserisci un comando valido", comando)
            }

            replyMessage(client, interaction, "Correct", "Comando in aggiornamento...", `Il comando \`${command.name}\` si sta eliminando e ricreando...`, comando)

            let port = command.client == "general" ? "1000" : command.client == "moderation" ? "3000" : command.client == "fun" ? "2000" : "4000"

            await fetch(`http://localhost:${port}/reload/${command.name}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": String(process.env.apiKey)
                }
            })

        }
        else if (interaction.options.getSubcommand() == "maintenance") {
            let where = interaction.options.getString("where")
            let mode = parseInt(interaction.options.getString("mode"))

            let serverstats = getServer()

            if (serverstats.maintenance[where] == mode) {
                return replyMessage(client, interaction, "Warning", "Modalità manutenzione già impostata", `In **${where == "local" ? "locale" : "host"}** la manuntezione è già settata a \`${mode == 0 ? `Off - Everyone can use bot` : mode == 1 ? `Mode 1 - Only tester can use bot` : mode == 2 ? `Mode 2 - Nobody can use bot` : mode == 3 ? `Mode 3 - Everyone, except testers, can use bot` : ""}\``, comando)
            }

            serverstats.maintenance[where] = mode

            updateServer(serverstats)

            replyMessage(client, interaction, "Correct", "Manutenzione impostata", `Stato di manutenzione in **${where == "local" ? "locale" : "host"}** settato a \`${mode == 0 ? `Off - Everyone can use bot` : mode == 1 ? `Mode 1 - Only tester can use bot` : mode == 2 ? `Mode 2 - Nobody can use bot` : mode == 3 ? `Mode 3 - Everyone, except testers, can use bot` : ""}\``, comando)
        }
        else if (interaction.options.getSubcommand() == "tester") {
            let utente = await getTaggedUser(client, interaction.options.getString("user"))
            let mode = interaction.options.getString("mode")

            if (!utente) {
                return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
            }

            let serverstats = getServer()

            if (mode == "add") {
                if (serverstats.testers.includes(utente.id)) {
                    return replyMessage(client, interaction, "Warning", "Utente già tester", `${utente.toString()} è già inserito come tester`, comando)
                }

                serverstats.testers.push(utente.id)

                updateServer(serverstats)

                replyMessage(client, interaction, "Correct", "Utente aggiunto come tester", `${utente.toString()} inserito come tester`, comando)
            }
            else if (mode == "remove") {
                if (!serverstats.testers.includes(utente.id)) {
                    return replyMessage(client, interaction, "Warning", "Utente già non tester", `${utente.toString()} è non è già un tester`, comando)
                }

                serverstats.testers = serverstats.testers.filter(x => x != utente.id)

                updateServer(serverstats)

                replyMessage(client, interaction, "Correct", "Utente rimosso come tester", `${utente.toString()} rimosso come tester`, comando)
            }
        }
        else if (interaction.options.getSubcommand() == "server") {
            let data = interaction.options.getString("type") == "server" ? getServer() : getServerStats()

            let embed = new Discord.MessageEmbed()
                .setTitle(interaction.options.getString("type") == "server" ? ":cd: Server DB file" : ":cd: Serverstats DB file")
                .setColor(colors.blue)
                .setDescription(interaction.options.getString("type") == "server" ? "Ecco il file del contenuto del DB di Server" : "Ecco il file del contenuto del DB di Serverstats")

            const attachment = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(data, null, "\t"), "utf-8"), `${interaction.options.getString("type")}${new Date().getTime()}.json`);

            interaction.reply({ embeds: [embed], files: [attachment] })
        }
        else if (interaction.options.getSubcommand() == "user") {
            let utente = await getTaggedUser(client, interaction.options.getString("user"))

            if (!utente) {
                return replyMessage(client, interaction, "Error", "Utente non trovato", "Hai inserito un utente non valido o non esistente", comando)
            }

            let data = interaction.options.getString("type") == "user" ? getUser(utente.id) : getUserStats(utente.id)

            if (!data) {
                return replyMessage(client, interaction, "Warning", "Utente non nel DB", `Il file di  ${utente.toString()} richiesto non è nel database del bot`, comando)
            }

            if (interaction.options.getString("mode") == "get") {
                let embed = new Discord.MessageEmbed()
                    .setTitle(interaction.options.getString("type") == "user" ? ":cd: User DB file" : ":cd: Userstats DB file")
                    .setColor(colors.blue)
                    .setDescription(interaction.options.getString("type") == "user" ? `Ecco il file del contenuto del DB User di ${utente.toString()}` : `Ecco il file del contenuto del DB Userstats di ${utente.toString()}`)

                const attachment = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(data, null, "\t"), "utf-8"), `${interaction.options.getString("type")}${new Date().getTime()}.json`);

                interaction.reply({ embeds: [embed], files: [attachment] })
            }
            else if (interaction.options.getString("mode") == "delete") {
                let embed = new Discord.MessageEmbed()
                    .setTitle(interaction.options.getString("type") == "user" ? ":cd: User DB file eliminato" : ":cd: Userstats DB file eliminato")
                    .setColor(colors.blue)
                    .setDescription(interaction.options.getString("type") == "user" ? `Il file del contenuto del DB User di ${utente.toString()} è stato eliminato` : `Il file del contenuto del DB Userstats di ${utente.toString()} è stato eliminato`)

                const attachment = await new Discord.MessageAttachment(Buffer.from(JSON.stringify(data, null, "\t"), "utf-8"), `${interaction.options.getString("type")}${new Date().getTime()}.json`);

                interaction.reply({ embeds: [embed], files: [attachment] })

                deleteUser(utente.id, interaction.options.getString("type") == "user" ? [true, false] : [false, true])
            }
        }
    },
};