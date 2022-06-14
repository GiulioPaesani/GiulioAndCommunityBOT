const Discord = require("discord.js")
const Docs = require("discord.js-docs")
const settings = require("../../config/general/settings.json")
const illustrations = require("../../config/general/illustrations.json")
const { getEmoji } = require("../../functions/general/getEmoji")
const fetch = require("node-fetch");

module.exports = {
    name: "docs",
    description: "Ricercare nella documentazione Discord.js",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/docs [query] (source)",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "html",
                description: "Documentazione HTML",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "css",
                description: "Documentazione CSS",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "javascript",
                description: "Documentazione JavaScript e Web APIs",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "discord-js",
                description: "Documentazione discord.js",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "collection",
                description: "Documentazione @discordjs/collection",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "builders",
                description: "Documentazione @discordjs/builders",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "voice",
                description: "Documentazione @discordjs/voice",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: "rpc",
                description: "Documentazione discord-rpc",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "query",
                        description: "Termini di ricerca della documentazione",
                        type: "STRING",
                        required: true,
                        autocomplete: true
                    }
                ]
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.codingGeneral, settings.idCanaliServer.help],
    async execute(client, interaction, comando) {
        let query = interaction.options.getString("query")
        let source = interaction.options.getSubcommand()

        if (source == "html" || source == "css" || source == "javascript") {
            let url = await fetch("https://developer.mozilla.org/en-US/search-index.json");
            let search = await url.json();

            let embed = new Discord.MessageEmbed()

            if (source == "html") {
                embed
                    .setTitle(`Docs HTML`)
                    .setThumbnail(illustrations.html)
                    .setColor("#E44F26")

                search = search.filter(x => x.url.startsWith("/en-US/docs/Web/HTML"))
            }
            else if (source == "css") {
                embed
                    .setTitle(`Docs CSS`)
                    .setThumbnail(illustrations.css)
                    .setColor("#2965F1")

                search = search.filter(x => x.url.startsWith("/en-US/docs/Web/CSS"))
            }
            else if (source == "javascript") {
                embed
                    .setTitle(`Docs JavaScript/Web APIs`)
                    .setThumbnail(illustrations.javascript)
                    .setColor("#FFE11C")

                search = search.filter(x => x.url.startsWith("/en-US/docs/Web/JavaScript") || x.url.startsWith("/en-US/docs/Web/API"))
            }

            let choices = []

            if (search.find(x => x.url == query)) {
                choices.push({ name: search.find(x => x.url == query).title, value: search.find(x => x.url == query).url })
            }
            else {
                search.forEach(x => {
                    if (x.title.toLowerCase().includes(query.toLowerCase())) {
                        if (!choices.find(y => y.title == x.title)) choices.push({ name: x.title, value: x.url })
                    }
                })

                if (choices.length < 10)
                    search.forEach(x => {
                        if (x.url.toLowerCase().includes(query.toLowerCase())) {
                            if (!choices.find(y => y.title == x.title)) choices.push({ name: x.title, value: x.url })
                        }
                    })
            }

            if (choices.length == 0) {
                embed
                    .setDescription(`**Risultati** trovati per \`${query}\``)
                    .addField(":mag: Risultati", "_Nessuna documentazione trovata_")

                interaction.reply({ embeds: [embed] })
            }
            else if (choices[0].url == query || choices.length == 1) {
                embed
                    .setDescription(`**[${choices[0].name}](https://developer.mozilla.org${choices[0].value})**`)

                interaction.reply({ embeds: [embed] })
            }
            else {
                let resultsList = ""

                let select = new Discord.MessageSelectMenu()
                    .setCustomId(`docsSearch,${interaction.user.id},${source}`)
                    .setPlaceholder('Select a docs...')
                    .setMaxValues(1)
                    .setMinValues(1)

                choices.slice(0, 10).forEach(choice => {
                    resultsList += `- ${choice.name}\n`

                    select.addOptions({
                        label: choice.name,
                        value: choice.value
                    })
                })

                embed
                    .setDescription(`**Risultati** trovati per \`${query}\``)
                    .addField(":mag: Risultati", resultsList)

                let row = new Discord.MessageActionRow()
                    .addComponents(select)

                interaction.reply({ embeds: [embed], components: [row] })
            }
        }
        else {
            if (source == "discord-js") source = "stable"

            const doc = await Docs.fetch(source)
            const results = await doc.resolveEmbed(query)

            if (results?.fields)
                results.fields.forEach(field => { field.value = field.value.slice(0, 1024) })

            let embed = new Discord.MessageEmbed()
                .setTitle(`Docs ${source == "stable" ? "Discord.js" : source == "collection" ? "@discordjs/collection" : source == "builders" ? "@discordjs/builders" : source == "voice" ? "@discordjs/voice" : source == "rpc" ? "discord-rpc" : ""}`)
                .setThumbnail(illustrations.discordjs)
                .setColor("#5865F2")

            if (!results) {
                embed
                    .setDescription(`**Risultati** trovati per \`${query}\``)
                    .addField(":mag: Risultati", "_Nessuna documentazione trovata_")

                interaction.reply({ embeds: [embed] })
            }
            else if (results.title == "Search results:") {
                let resultsList = ""

                let select = new Discord.MessageSelectMenu()
                    .setCustomId(`docsSearch,${interaction.user.id},${source}`)
                    .setPlaceholder('Select a docs...')
                    .setMaxValues(1)
                    .setMinValues(1)

                results.description.split("\n").forEach(result => {
                    resultsList += `${result.startsWith(":regional_indicator_c:") ? getEmoji(client, "Class") : result.startsWith(":regional_indicator_t:") ? getEmoji(client, "Typedef") : result.startsWith(":regional_indicator_m:") ? getEmoji(client, "Method") : result.startsWith(":regional_indicator_p:") ? getEmoji(client, "Property") : getEmoji(client, "Event")} ${result.slice(26).split("]")[0]}\n`

                    select.addOptions({
                        label: result.slice(26).split("]")[0].slice(0, 100),
                        emoji: result.startsWith(":regional_indicator_c:") ? getEmoji(client, "Class") : result.startsWith(":regional_indicator_t:") ? getEmoji(client, "Typedef") : result.startsWith(":regional_indicator_m:") ? getEmoji(client, "Method") : result.startsWith(":regional_indicator_p:") ? getEmoji(client, "Property") : getEmoji(client, "Event"),
                        value: result.slice(26).split("]")[0].slice(0, 100)
                    })
                })

                embed
                    .setDescription(`**Risultati** trovati per \`${query}\``)
                    .addField(":mag: Risultati", resultsList)

                let row = new Discord.MessageActionRow()
                    .addComponents(select)

                interaction.reply({ embeds: [embed], components: [row] })
            }
            else {
                embed
                    .setDescription(results.description)
                    .addFields(results.fields.slice(0, -1))

                interaction.reply({ embeds: [embed] })
            }
        }
    },
};