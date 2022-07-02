const Discord = require("discord.js")
const moment = require("moment")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("scopriSubVideo")) return

        let idVideo = interaction.customId.split(",")[1]
        let publishdate = interaction.customId.split(",")[2]

        let embed = new Discord.MessageEmbed()
            .setTitle(`:projector: Ricerca video`)
            .setColor(colors.blue)
            .setDescription(`${getEmoji(client, "Loading")} Caricamento video...`)

        interaction.followUp({ embeds: [embed], components: [], ephymeral: true })

        getInfo(`https://www.youtube.com/watch?v=${idVideo}`)
            .then(async (info) => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(info.items[0].title)
                    .setColor(colors.blue)
                    .setThumbnail(info.items[0].thumbnail)
                    .setDescription(`
${humanizeTime(info.items[0].duration)}

:gem: Video in anteprima, uscirà pubblicamente il ${moment(publishdate, "DD/MM/YYYY").format("DD/MM/yyyy")}`)

                let button1 = new Discord.MessageButton()
                    .setURL(`https://www.youtube.com/watch?v=${idVideo}`)
                    .setStyle("LINK")
                    .setLabel("Vai al video")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                interaction.editReply({ embeds: [embed], components: [row] })
            })
    },
};
