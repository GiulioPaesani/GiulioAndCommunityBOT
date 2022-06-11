const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const colors = require("../../config/general/colors.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { getEmoji } = require("../../functions/general/getEmoji");
const { isMaintenance } = require("../../functions/general/isMaintenance");
const fetch = require("node-fetch");

module.exports = {
    name: "lyrics",
    description: "Ottenere il testo completo del brano in riproduzione",
    permissionLevel: 0,
    requiredLevel: 50,
    syntax: "/lyrics",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)

        if (!queue) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da cui prendere il test", comando)
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Ricerca lyrics...`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Ricerca lyrics del brano in riproduzione`)

        interaction.reply({ embeds: [embed] })

        function getSong(title) {
            return new Promise(async function (resolve, reject) {
                let response = await fetch(`https://some-random-api.ml/lyrics/?title=${title}`)
                response = await response.json()
                resolve(response)
            })
        }

        let song;
        do {
            song = await getSong(queue.songs[0].name)
        } while (song.error && song.error == "Internal server error")

        if (!song.lyrics) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`:microphone: Ricerca lyrics`)
                .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
                .setDescription(`Nessun testo trovato per il brano in riproduzione`)

            interaction.editReply({ embeds: [embed] })
            return
        }

        let pages = []
        let totPage = 0
        song.lyrics.split("\n").forEach(x => {
            if (!pages[totPage]) pages[totPage] = ""
            if (pages[totPage].length + 2 + x.length <= 1024) {
                pages[totPage] += `\n${x}`
            }
            else {
                pages[totPage + 1] = `${x}`
                totPage++
            }
        });

        totPage = pages.length
        let page = 1
        embed = new Discord.MessageEmbed()
            .setTitle(":microphone: Lyrics")
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .addField(`${song.title} - ${song.author}`, pages[page - 1])
            .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroLyrics`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) button1.setDisabled()

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiLyrics`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) button2.setDisabled()

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.editReply({ embeds: [embed], components: totPage > 1 ? [row] : [], fetchReply: true })
            .then(msg => {
                const collector = msg.createMessageComponentCollector();

                collector.on('collect', i => {
                    if (!i.isButton()) return
                    if (isMaintenance(i.user.id)) return

                    i.deferUpdate().catch(() => { })

                    if (i.user.id != interaction.user.id) return

                    if (i.customId == "indietroLyrics") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "avantiLyrics") {
                        page++
                        if (page > totPage) page = totPage
                    }

                    embed = new Discord.MessageEmbed()
                        .setTitle(":microphone: Lyrics")
                        .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
                        .addField(`${song.title} - ${song.author}`, pages[page - 1])
                        .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

                    button1 = new Discord.MessageButton()
                        .setCustomId(`indietroLyrics`)
                        .setStyle("PRIMARY")
                        .setEmoji(getEmoji(client, "Previous"))

                    if (page == 1) button1.setDisabled()

                    button2 = new Discord.MessageButton()
                        .setCustomId(`avantiLyrics`)
                        .setStyle("PRIMARY")
                        .setEmoji(getEmoji(client, "Next"))

                    if (page == totPage) button2.setDisabled()

                    row = new Discord.MessageActionRow()
                        .addComponents(button1)
                        .addComponents(button2)

                    msg.edit({ embeds: [embed], components: [row] })
                })
            })
    },
};