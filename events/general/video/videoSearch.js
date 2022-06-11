const Discord = require("discord.js");
const moment = require("moment");
const colors = require("../../../config/general/colors.json");
const { getInfo } = require("ytdl-getinfo");
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { humanize } = require("../../../functions/general/humanize");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { humanizeTime } = require("../../../functions/general/humanizeTime");

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("videoSearch")) return

        if (isMaintenance(interaction.user.id)) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Menu non tuo", "Questo menu è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let embed = new Discord.MessageEmbed()
            .setTitle(`:projector: Ricerca video`)
            .setColor(colors.blue)
            .setDescription(`${getEmoji(client, "Loading")} Caricamento video...`)

        interaction.message.edit({ embeds: [embed], components: [] })

        getInfo(`https://www.youtube.com/watch?v=${interaction.values[0]}`)
            .then(async (info) => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(info.items[0].title)
                    .setColor(colors.blue)
                    .setThumbnail(info.items[0].thumbnail)
                    .setDescription(`
${humanizeTime(info.items[0].duration)}

:eye: ${humanize(info.items[0].view_count)} Views - :thumbsup: ${humanize(info.items[0].like_count)} Likes

_Uploaded by_ [${info.items[0].channel}](${info.items[0].channel_url})`)

                let button1 = new Discord.MessageButton()
                    .setURL(info.items[0].webpage_url)
                    .setStyle("LINK")
                    .setLabel("Vai al video")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                interaction.message.edit({ embeds: [embed], components: [row] })
            })
    },
};