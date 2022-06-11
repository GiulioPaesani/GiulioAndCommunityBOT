const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const { humanizeTime } = require("../../functions/general/humanizeTime");
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "nowplaying",
    description: "Visualizzare informazioni sul brano in riproduzione",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/nowplaying",
    category: "music",
    client: "general",
    musicMode: true,
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando, distube, musicClient) {
        let queue = distube.getQueue(interaction.guild.id);
        if (!queue) {
            return replyMessage(client, interaction, "Warning", "Nessuna traccia in riproduzione", "Non c'è nessuna traccia da cui visualizzare le informazioni", comando)
        }

        let song = queue.songs[0];

        let songProgress = ""
        let numEmoji = 8;
        let value = queue.currentTime;
        let maxValue = song.duration
        for (let i = 1; i <= numEmoji; i++) {
            if (i == 1) {
                if (value < parseInt(maxValue / numEmoji / 4)) {
                    songProgress += getEmoji(client, "song13")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * 2) {
                    songProgress += getEmoji(client, "song14")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * 3) {
                    songProgress += getEmoji(client, "song15")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * 4) {
                    songProgress += getEmoji(client, "song16")
                }
                else {
                    songProgress += getEmoji(client, "song17")
                }
            }
            else if (i == numEmoji) {
                if (value < parseInt(maxValue / numEmoji / 4) * ((numEmoji - 2) * 4 + 3) - parseInt(maxValue / numEmoji / 4) * 2) {
                    songProgress += getEmoji(client, "song33")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((numEmoji - 2) * 4 + 3) - parseInt(maxValue / numEmoji / 4) * 1) {
                    songProgress += getEmoji(client, "song34")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((numEmoji - 2) * 4 + 3)) {
                    songProgress += getEmoji(client, "song35")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((numEmoji - 2) * 4 + 3) + parseInt(maxValue / numEmoji / 4) * 1) {
                    songProgress += getEmoji(client, "song36")
                }
                else {
                    songProgress += getEmoji(client, "song37")
                }
            }
            else {
                if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4) - parseInt(maxValue / numEmoji / 4) * 2) {
                    songProgress += getEmoji(client, "song21")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4) - parseInt(maxValue / numEmoji / 4) * 1) {
                    songProgress += getEmoji(client, "song22")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4)) {
                    songProgress += getEmoji(client, "song23")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4) + parseInt(maxValue / numEmoji / 4) * 1) {
                    songProgress += getEmoji(client, "song24")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4) + parseInt(maxValue / numEmoji / 4) * 2) {
                    songProgress += getEmoji(client, "song25")
                }
                else if (value < parseInt(maxValue / numEmoji / 4) * ((i - 1) * 4) + parseInt(maxValue / numEmoji / 4) * 3) {
                    songProgress += getEmoji(client, "song26")
                }
                else {
                    songProgress += getEmoji(client, "song27")
                }
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle("Now playing")
            .setColor(settings.botMusicali.find(x => x.id == musicClient.user.id).color)
            .setThumbnail(song.thumbnail)
            .addField(song.name, `
${queue.paused ? "_Paused_" : ""}
${song.isLive ? `Live` : `${humanizeTime(queue.currentTime)} / ${humanizeTime(song.duration)}`}
${songProgress}

:postal_horn: Song requested by ${song.user.toString()}
:microphone2: Author: [${song.uploader.name}](${song.uploader.url})
`)
        if (queue.songs[1]) {
            embed.addField(":track_next: Next track", `
${queue.songs[1].name.length > 70 ? `${queue.songs[1].name.slice(0, 67)}...` : queue.songs[1].name} - _${queue.songs[1].isLive ? "Live" : humanizeTime(queue.songs[1].duration)}_
${queue.songs.length - 2 > 0 ? `_Other ${queue.songs.length - 2} track in queue_` : ""}`)
        }
        if (queue.repeatMode || queue.autoplay || queue.filters.length > 0) {
            embed.addField(":notes: Queue", `
${queue.repeatMode == 1 ? ":repeat_one: Loop song - Al termine delle riproduzione del brano, verrà riprodotto di nuovo\n" : queue.repeatMode == 2 ? ":repeat: Loop queue - Al termine delle riproduzione della coda, verrà riprodotto di nuovo il primo brano\n" : ""}${queue.autoplay ? ":crystal_ball: Autoplay ON - Al termine della coda verranno riprodotti i brani correlati, se disponibili\n" : ""}${queue.filters.length > 0 ? `:alien: Effect ON - Alla riproduzione dei brani è applicato l'effetto \`${queue.filters[0]}\`` : ""}
`)
        }

        let button1 = new Discord.MessageButton()
            .setURL(song.url)
            .setStyle("LINK")
            .setLabel("Vai al brano")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        interaction.reply({ embeds: [embed], components: [row] })
    },
};