const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { getEmoji } = require("../../functions/general/getEmoji");
const { isMaintenance } = require("../../functions/general/isMaintenance");
const { humanizeTime } = require("../../functions/general/humanizeTime");

module.exports = {
    name: "queue",
    description: "Visualizzare tutta la coda di riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/queue",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let queue = distube.getQueue(interaction.guild.id)
        if (!queue) queue = { songs: [] }

        let queueList = ""

        let totPage = Math.ceil(queue.songs.length / 10)
        let page = 1;

        for (let i = 10 * (page - 1); i < 10 * page; i++) {
            if (queue.songs[i]) {
                queueList += `**#${i + 1}** ${queue.songs[i].name.length > 70 ? `${queue.songs[i].name.slice(0, 67)}...` : queue.songs[i].name} - _${i == 0 ? (queue.paused ? "Paused" : queue.songs[i].isLive ? "Live" : `${humanizeTime(queue.songs[i].duration - queue.currentTime)} remaining`) : queue.songs[i].isLive ? "Live" : humanizeTime(queue.songs[i].duration)}_\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Queue")
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .addField(`:notes: ${queue.songs.length} ${queue.songs.length == 1 ? "track" : "tracks"}`, queueList || "_Nessuna traccia in coda_")
            .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroQueue`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) button1.setDisabled()

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiQueue`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) button2.setDisabled()

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: totPage > 1 ? [row] : [], fetchReply: true })
            .then(msg => {
                const collector = msg.createMessageComponentCollector();

                collector.on('collect', i => {
                    if (!i.isButton()) return
                    if (isMaintenance(i.user.id)) return

                    i.deferUpdate().catch(() => { })

                    if (i.user.id != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

                    if (i.customId == "indietroQueue") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "avantiQueue") {
                        page++
                        if (page > totPage) page = totPage
                    }
                    queueList = ""

                    totPage = Math.ceil(queue.songs.length / 10)

                    for (let i = 10 * (page - 1); i < 10 * page; i++) {
                        if (queue.songs[i]) {
                            queueList += `**#${i + 1}** ${queue.songs[i].name.length > 70 ? `${queue.songs[i].name.slice(0, 67)}...` : queue.songs[i].name} - _${i == 0 ? (queue.paused ? "Paused" : queue.songs[i].isLive ? "Live" : `${humanizeTime(queue.songs[i].duration - queue.currentTime)} remaining`) : queue.songs[i].isLive ? "Live" : humanizeTime(queue.songs[i].duration)}_\n`
                        }
                    }

                    embed = new Discord.MessageEmbed()
                        .setTitle("Queue")
                        .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
                        .addField(`:notes: ${queue.songs.length} ${queue.songs.length == 1 ? "track" : "tracks"}`, queueList || "_Nessuna traccia in coda_")
                        .setFooter({ text: totPage > 1 ? `Page ${page}/${totPage}` : "" })

                    button1 = new Discord.MessageButton()
                        .setCustomId(`indietroQueue`)
                        .setStyle("PRIMARY")
                        .setEmoji(getEmoji(client, "Previous"))

                    if (page == 1) button1.setDisabled()

                    button2 = new Discord.MessageButton()
                        .setCustomId(`avantiQueue`)
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