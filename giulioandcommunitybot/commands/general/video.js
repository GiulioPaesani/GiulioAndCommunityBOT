const Discord = require("discord.js");
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const { getEmoji } = require("../../functions/general/getEmoji");
const yt = require('youtube-search-without-api-key');

module.exports = {
    name: "video",
    description: "Cercare un video su youtube",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/video [query]",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "query",
                description: "Ricerca del video da cercare",
                type: "STRING",
                required: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let query = interaction.options.getString("query")

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ricerca video...`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Ricerca video su YouTube per \`${query}\``)

        interaction.reply({ embeds: [embed] })

        yt.search(query)
            .then(videos => {
                if (videos.length == 0) {
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`:projector: Ricerca video`)
                        .setColor(colors.yellow)
                        .setDescription(`Nessun risultato per\n\`${query}\``)

                    interaction.editReply({ embeds: [embed] })
                    return
                }

                let select = new Discord.MessageSelectMenu()
                    .setCustomId(`videoSearch,${interaction.user.id}`)
                    .setPlaceholder('Select a video...')
                    .setMaxValues(1)
                    .setMinValues(1)

                let videosList = ""
                videos.filter(x => x.duration_raw).slice(0, 10).forEach((video, index) => {
                    videosList += `**#${index + 1}** ${video.title.length > 50 ? `${video.title.slice(0, 47)}...` : video.title}\n`
                })

                videos.filter(x => x.duration_raw).slice(0, 10).forEach(video => {
                    select.addOptions({
                        label: `${video.title.length > 100 ? `${video.title.slice(0, 97)}...` : video.title}`,
                        description: `${video.duration_raw} - ${video.snippet.publishedAt}`,
                        value: video.id.videoId
                    })
                })

                let embed = new Discord.MessageEmbed()
                    .setTitle(`:projector: Ricerca video`)
                    .setColor(colors.yellow)
                    .setDescription(`**Risultati** trovati per \`${query}\``)
                    .addField(":mag: Risultati", videosList)
                    .setFooter({ text: "Seleziona un video dal menu per avere più informazioni" })

                let row = new Discord.MessageActionRow()
                    .addComponents(select)

                interaction.editReply({ embeds: [embed], components: [row] })
            })
    },
};