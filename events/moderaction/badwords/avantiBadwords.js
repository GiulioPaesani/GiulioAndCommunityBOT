const Discord = require('discord.js');
const badwords = require('../../../config/moderation/badwords.json');
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji");
const { replyMessage } = require('../../../../giulioandcommunitybot/functions/general/replyMessage');

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("avantiBadwords")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let badwordsList = ""

        let totPage = Math.ceil(badwords.length / 20)
        let page = parseInt(interaction.customId.split(",")[2]) + 1;
        if (page > totPage) return

        for (let i = 20 * (page - 1); i < 20 * page; i++) {
            if (badwords[i]) {
                badwordsList += `${badwords[i]}\n`
            }
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":zipper_mouth: Badwords")
            .setDescription(`Lista completa di tutte le espressioni proibite nel server
Trovi l'elenco completo anche [QUI](https://github.com/GiulioPaesani/GiulioAndCommunityBOT/blob/main/config/moderation/badwords.json)
            
:warning: _Se siete sensibili o deboli di cuore evitate di vedere questa lista_`)
            .addField("\u200b", `||${badwordsList}||`)
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroBadwords,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiBadwords,${interaction.user.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};