const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const settings = require("../../../config/general/settings.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getInfo } = require("ytdl-getinfo");
const { humanizeTime } = require("../../../functions/general/humanizeTime");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("scopriSubVideo")) return

        let idVideo = interaction.customId.split(",")[1]
        let publishdate = interaction.customId.split(",")[2]

        setTimeout(async () => {
            await interaction.deferUpdate().catch(() => { })
        }, 2000)

        getInfo(`https://www.youtube.com/watch?v=${idVideo}`)
            .then(async (info) => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(info.items[0].title)
                    .setColor(colors.blue)
                    .setThumbnail(info.items[0].thumbnail)
                    .setDescription(`:gem: Video in anteprima, uscirà pubblicamente il ${moment(publishdate, "DD/MM/YYYY").format("DD/MM/yyyy")}`)

                let button1 = new Discord.MessageButton()
                    .setURL(`https://www.youtube.com/watch?v=${idVideo}`)
                    .setStyle("LINK")
                    .setLabel("Vai al video")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                interaction.followUp({ embeds: [embed], components: [row], ephemeral: true })
            })
    },
};
