const Discord = require("discord.js")
const items = require("../../../config/ranking/items.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { humanize } = require("../../../functions/general/humanize");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("avantiInv")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let utente = client.users.cache.get(interaction.customId.split(",")[2])
        let userstats = await getUser(utente.id)
        if (!userstats) userstats = await addUser(interaction.guild.members.cache.get(utente.id) || utente)

        let totItems = 0
        let userItems = []

        for (let index in userstats.economy.inventory) {
            if (userstats.economy.inventory[index] && userstats.economy.inventory[index] > 0) {
                totItems += userstats.economy.inventory[index]
                userItems.push({ item: items.find(x => x.id == index), quantity: userstats.economy.inventory[index] })
            }
        }

        let totPage = Math.ceil(userItems.length / 9)
        let page = parseInt(interaction.customId.split(",")[3])
        page++
        if (page > totPage) page = totPage

        let embed = new Discord.MessageEmbed()
            .setTitle(":handbag: Inventory :handbag:")
            .setColor(colors.purple)
            .setDescription(`Tutto l'inventario di ${utente.toString()} con gli oggetti che possiede
_Oggetti totali: ${totItems}_`)
            .setFooter({ text: totPage > 1 ? `Coins: ${humanize(userstats.economy.money)}$ - Page ${page}/${totPage}` : `Coins: ${humanize(userstats.economy.money)}$` })

        for (let i = 9 * (page - 1); i < 9 * page; i++) {
            if (userItems[i]) {
                embed
                    .addField(`${getEmoji(client, userItems[i].item.name.toLowerCase())} ${userItems[i].item.name}`, `ID: \`#${userItems[i].item.id}\`\nQuantity: ${userItems[i].quantity}`, true)
            }
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroInv,${interaction.user.id},${utente.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiInv,${interaction.user.id},${utente.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.message.edit({ embeds: [embed], components: totPage > 1 ? [row] : [] })
    },
};
