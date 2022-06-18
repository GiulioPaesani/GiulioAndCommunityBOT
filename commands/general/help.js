const Discord = require("discord.js");
const fetch = require("node-fetch")
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji");
const { replyMessage } = require("../../functions/general/replyMessage.js");

module.exports = {
    name: "help",
    description: "Lista completa dei comandi del bot",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 10,
    syntax: "/help (category) (command)",
    category: "general",
    data: {
        options: [
            {
                name: "category",
                description: "Categoria dei comandi da visualizzare",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "🎡 General",
                        value: "general"
                    },
                    {
                        name: "💡 Community",
                        value: "community"
                    },
                    {
                        name: "📊 Informations",
                        value: "info"
                    },
                    {
                        name: "🎵 Music",
                        value: "music"
                    },
                    {
                        name: "😂 Fun and Games",
                        value: "fun"
                    },
                    {
                        name: "💵 Ranking",
                        value: "ranking"
                    },
                    {
                        name: "👮 Moderation",
                        value: "moderation"
                    },
                    {
                        name: "🔐 Tickets anche Private rooms",
                        value: "rooms"
                    }
                ]
            },
            {
                name: "command",
                description: "Comando specifico di cui vedere delle informazioni",
                type: "STRING",
                required: false,
                autocomplete: true,
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let category = interaction.options.getString("category")
        let command = interaction.options.getString("command")

        if (command) {
            let command = client.commands.get(interaction.options.getString("command"))

            if (!command) {
                return replyMessage(client, interaction, "Error", "Comando non trovato", "Inserisci un comando valido", comando)
            }

            let channelsGranted = ""
            if (command.name == "say")
                channelsGranted = `<#${settings.idCanaliServer.commands}>\n_All channels from ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level 60`).toString()}_`
            else if (command.name.startsWith("p") && command.category == "rooms" && command.name != "pinvite")
                channelsGranted = `<#${settings.idCanaliServer.commands}>\n_All private rooms_`
            else if (command.name.startsWith("t") && command.category == "rooms")
                channelsGranted = `<#${settings.idCanaliServer.commands}>\n_All tickets_`
            else
                channelsGranted = command.channelsGranted.length == 0 ? "All channels" : command.channelsGranted.map(x => client.channels.cache.get(x).toString()).join("\n")

            let embed = new Discord.MessageEmbed()
                .setTitle(`/${command.name.toUpperCase()}`)
                .setDescription(command.description)
                .setColor(command.category == "general" ? "#A0ADB7" : command.category == "community" ? "#F6D17E" : command.category == "info" ? "#C5CED5" : command.category == "music" ? "#58A3DE" : command.category == "fun" ? "#F2C249" : command.category == "ranking" ? "#A5D089" : command.category == "moderation" ? "#2A6797" : "#FFAC33")
                .addField(":keyboard: Syntax", command.syntax)
                .addField(":gem: Permission required", command.permissionLevel == 0 ? "Accessible to everyone" : command.permissionLevel == 1 ? `Accessible to only ${getEmoji(client, "ModCommand")} Moderators` : command.permissionLevel == 2 ? `Accessible to only ${getEmoji(client, "AdmimCommand")} Admins` : `Accessible to only ${getEmoji(client, "OwnerCommand")} Owners`, true)
                .addField(":beginner: Level required", command.requiredLevel == 0 ? "No level required" : `${interaction.guild.roles.cache.find(x => x.name == `Level ${command.requiredLevel}`).toString()} required`, true)
                .addField(":bricks: Category", command.category == "general" ? "General" : command.category == "community" ? "Community" : command.category == "info" ? "Informations" : command.category == "music" ? "Music" : command.category == "fun" ? "Fun and Games" : command.category == "ranking" ? "Ranking" : command.category == "moderation" ? "Moderation" : "Private rooms and Tickets", true)
                .addField(":anchor: Channels granted", channelsGranted)
                .addField(":stopwatch: Cooldown", command.cooldown ? `${command.cooldown} seconds` : "No cooldown")

            interaction.reply({ embeds: [embed] })
        }
        else {
            let embed = new Discord.MessageEmbed()

            switch (category) {
                case "general": {
                    embed
                        .setTitle("🎡 GENERAL commands 🎡")
                        .setColor("#A0ADB7")
                } break
                case "community": {
                    embed
                        .setTitle("💡 COMMUNITY commands 💡")
                        .setColor("#F6D17E")
                } break
                case "info": {
                    embed
                        .setTitle("📊 INFORMATIONS commands 📊")
                        .setColor("#C5CED5")
                } break
                case "music": {
                    embed
                        .setTitle("🎵 MUSIC commands 🎵")
                        .setColor("#58A3DE")
                } break
                case "fun": {
                    embed
                        .setTitle("😂 FUN and GAMES commands 😂")
                        .setColor("#F2C249")
                } break
                case "ranking": {
                    embed
                        .setTitle("💵 RANKING commands 💵")
                        .setColor("#A5D089")
                } break
                case "moderation": {
                    embed
                        .setTitle("👮 MODERATION commands 👮")
                        .setColor("#2A6797")
                } break
                case "rooms": {
                    embed
                        .setTitle("🔐 TICKETS and PRIVATE ROOMS commands 🔐")
                        .setColor("#FFAC33")
                } break
                default: {
                    embed
                        .setTitle(":robot: Tutti i COMANDI :robot:")
                        .setDescription(`Tutti i **comandi** disponibili all'interno di <@${client.user.id}> e di tutti gli altri BOT presenti nel server
    Per avere più dettagli del server leggi in <#${settings.idCanaliServer.info}>`)
                        .addField("Categorie", `
    I comandi sono divisi nelle seguenti categorie:
    🎡 General 
    💡 Community
    📊 Informations
    🎵 Music
    😂 Fun and Games
    💵 Ranking
    👮 Moderation
    🔐 Tickets and Private rooms
    
    _Seleziona la categoria dal menù qua sotto_`)
                } break
            }

            let row2 = new Discord.MessageActionRow()
            if (category) {

                let commands = [...client.commands.filter(x => x.category == category).map(x => x)]

                let totPage = Math.ceil(commands.length / 9)
                let page = 1;

                for (let i = 9 * (page - 1); i < 9 * page; i++) {
                    if (commands[i]) {
                        embed
                            .addField(`/${commands[i].name} ${commands[i].permissionLevel == 3 ? getEmoji(client, "OwnerCommand") : commands[i].permissionLevel == 2 ? getEmoji(client, "AdminCommand") : commands[i].permissionLevel == 1 ? getEmoji(client, "ModCommand") : ""}`, `
    ${commands[i].description}
    `, true)
                    }
                }

                let button1 = new Discord.MessageButton()
                    .setCustomId(`indietroHelp,${interaction.user.id},${page},${category}`)
                    .setStyle("PRIMARY")
                    .setEmoji(getEmoji(client, "Previous"))

                if (page == 1) {
                    button1.setDisabled()
                }

                let button2 = new Discord.MessageButton()
                    .setCustomId(`avantiHelp,${interaction.user.id},${page},${category}`)
                    .setStyle("PRIMARY")
                    .setEmoji(getEmoji(client, "Next"))

                if (page == totPage) {
                    button2.setDisabled()
                }

                row2
                    .addComponents(button1)
                    .addComponents(button2)

                embed
                    .setFooter({ text: `Page ${page}/${totPage} - Usa /help (command) per avere più informazioni` })
            }

            let select = new Discord.MessageSelectMenu()
                .setCustomId(`helpMenu,${interaction.user.id}`)
                .setPlaceholder('Select category...')
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions({
                    label: "General",
                    emoji: "🎡",
                    value: "general",
                    description: "/help, /code, /segnala, /video, ..."
                })
                .addOptions({
                    label: "Community",
                    emoji: "💡",
                    value: "community",
                    description: "/suggest, /poll, /birthday, /question, ..."
                })
                .addOptions({
                    label: "Informations",
                    emoji: "📊",
                    value: "info",
                    description: "/serverinfo, /channelinfo, /link, /youtube, ..."
                })
                .addOptions({
                    label: "Music",
                    emoji: "🎵",
                    value: "music",
                    description: "/play, /queue, /shuffle, /lyrics, ..."
                })
                .addOptions({
                    label: "Fun and Games",
                    emoji: "😂",
                    value: "fun",
                    description: "/say, /meme, /funuser, /hack, ..."
                })
                .addOptions({
                    label: "Ranking",
                    emoji: "💵",
                    value: "ranking",
                    description: "/rank, /leaderboard, /buy, /inventory, ..."
                })
                .addOptions({
                    label: "Moderation",
                    emoji: "👮",
                    value: "moderation",
                    description: "/infractions, /ban, /tempmute, /badwords, ..."
                })
                .addOptions({
                    label: "Tickets and Private rooms",
                    emoji: "🔐",
                    value: "rooms",
                    description: "/tclose, /tadd, /pinfo, /prename, /pdelete, ..."
                })

            let row = new Discord.MessageActionRow()
                .addComponents(select)

            interaction.reply({ embeds: [embed], components: category ? [row2, row] : [row] })
        }
    },
};