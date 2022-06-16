const Discord = require("discord.js")
const settings = require("../../config/general/settings.json");
const colors = require("../../config/general/colors.json");
const { getEmoji } = require("../../functions/general/getEmoji");
const { humanizeTime } = require("../../functions/general/humanizeTime");

module.exports = {
    name: "search",
    description: "Cercare una brano da aggiungere alla coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 30,
    syntax: "/search [query]",
    category: "music",
    client: "general",
    musicMode: true,
    data: {
        options: [
            {
                name: "query",
                description: "Ricerca del brano da cercare",
                type: "STRING",
                required: true,
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let query = interaction.options.getString("query")

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ricerca brani...`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Ricerca brani per \`${query}\``)

        interaction.reply({ embeds: [embed] })

        let results = await distube.search(query)

        if (results.length == 0) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`:musical_note: Ricerca brani`)
                .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
                .setDescription(`Nessun risultato per\n\`${query}\``)

            interaction.editReply({ embeds: [embed] })
            return
        }

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`songSearch,${interaction.user.id},${musicClient.user.id}`)
            .setPlaceholder('Select a song...')
            .setMaxValues(1)
            .setMinValues(1)

        let songsList = ""
        results.forEach((song, index) => {
            songsList += `**#${index + 1}** ${song.name.length > 50 ? `${song.name.slice(0, 47)}...` : song.name}\n`
        })

        results.forEach(song => {
            select.addOptions({
                label: `${song.name.length > 100 ? `${song.name.slice(0, 97)}...` : song.name}`,
                description: `${song.isLive ? "Live" : humanizeTime(song.duration)} - ${song.uploader.name}`,
                value: song.id
            })
        })

        embed = new Discord.MessageEmbed()
            .setTitle(`:musical_note: Ricerca brani`)
            .setColor(colors.yellow)
            .setDescription(`**Risultati** trovati per \`${query}\``)
            .addField(":mag: Risultati", songsList)
            .setFooter({ text: "Seleziona un brano dal menu per aggiungerlo alla coda" })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.editReply({ embeds: [embed], components: [row] })
    },
};