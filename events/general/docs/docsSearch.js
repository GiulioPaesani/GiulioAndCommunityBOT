const Discord = require("discord.js");
const fetch = require("node-fetch");
const Docs = require("discord.js-docs")
const illustrations = require("../../../config/general/illustrations.json");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("docsSearch")) return

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let source = interaction.customId.split(",")[2]
        let query = interaction.values[0]

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

            embed
                .setDescription(`**[${search.find(x => x.url == query).title}](https://developer.mozilla.org${search.find(x => x.url == query).url})**`)

            interaction.message.edit({ embeds: [embed], components: [] })
        }
        else {
            const doc = await Docs.fetch(source)
            const results = await doc.resolveEmbed(query)

            if (results?.fields)
                results.fields.forEach(field => { field.value = field.value.slice(0, 1024) })

            let embed = new Discord.MessageEmbed()
                .setTitle(`Docs ${source == "stable" ? "Discord.js" : source == "collection" ? "@discordjs/collection" : source == "builders" ? "@discordjs/builders" : source == "voice" ? "@discordjs/voice" : source == "rpc" ? "discord-rpc" : ""}`)
                .setThumbnail(illustrations.discordjs)
                .setColor("#5865F2")

            embed
                .setDescription(results.description)
                .addFields(results.fields.slice(0, -1))

            interaction.message.edit({ embeds: [embed], components: [] })
        }
    },
};