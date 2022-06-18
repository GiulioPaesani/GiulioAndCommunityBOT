const Docs = require("discord.js-docs")
const fetch = require("node-fetch");

module.exports = {
    commandName: "docs",
    optionName: "query",
    async getResponse(client, focused, interaction) {
        if (!focused.value) return

        if (interaction.options.getSubcommand() == "html" || interaction.options.getSubcommand() == "css" || interaction.options.getSubcommand() == "javascript") {
            let url = await fetch("https://developer.mozilla.org/en-US/search-index.json");
            let search = await url.json();

            let choices = []

            search.forEach(x => {
                if ((interaction.options.getSubcommand() == "html" && x.url.startsWith("/en-US/docs/Web/HTML")) || (interaction.options.getSubcommand() == "css" && x.url.startsWith("/en-US/docs/Web/CSS")) || (interaction.options.getSubcommand() == "javascript" && (x.url.startsWith("/en-US/docs/Web/JavaScript") || x.url.startsWith("/en-US/docs/Web/API"))))
                    if (x.title.toLowerCase().includes(focused.value.toLowerCase())) {
                        if (!choices.find(y => y.title == x.title)) choices.push({ name: x.title, value: x.url })
                    }
            })

            if (choices.length < 25)
                search.forEach(x => {
                    if ((interaction.options.getSubcommand() == "html" && x.url.startsWith("/en-US/docs/Web/HTML")) || (interaction.options.getSubcommand() == "css" && x.url.startsWith("/en-US/docs/Web/CSS")) || (interaction.options.getSubcommand() == "javascript" && (x.url.startsWith("/en-US/docs/Web/JavaScript") || x.url.startsWith("/en-US/docs/Web/API"))))
                        if (x.url.toLowerCase().includes(focused.value.toLowerCase())) {
                            if (!choices.find(y => y.title == x.title)) choices.push({ name: x.title, value: x.url })
                        }
                })

            return choices
        }
        else {
            let source = interaction.options.getSubcommand()

            if (source == "discord-js") source = "stable"

            const doc = await Docs.fetch(source)
            const results = await doc.resolveEmbed(focused.value.toLowerCase())
            if (!results) return []

            let choices = []

            if (results.title == "Search results:") {
                results.description.split("\n").forEach(result => {
                    choices.push(result.slice(26).split("]")[0])
                })
            }
            else {
                choices.push(results.description.split("[")[1].split("]")[0])
            }

            return choices.map(x => ({ name: x, value: x }))
        }
    }
}