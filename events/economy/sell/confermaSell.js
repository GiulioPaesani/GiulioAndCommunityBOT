const Discord = require("discord.js")
const items = require("../../../config/ranking/items.json")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")
const moment = require("moment")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { humanize } = require("../../../functions/general/humanize");
const { updateUser } = require("../../../functions/database/updateUser");
const { getEmoji } = require("../../../functions/general/getEmoji")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaSell")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let item = items.find(x => x.id == interaction.customId.split(",")[2])
        let quantity = parseInt(interaction.customId.split(",")[3])

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        if ((userstats.economy.inventory[item.id] || 0) < quantity) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Item non sufficienti")
                .setColor(colors.gray)
                .setDescription("Non hai abbastanza oggetti nell'inventario per venderli")

            interaction.message.edit({ embeds: [embed], components: [] })
            return
        }

        userstats.economy.inventory[item.id] = userstats.economy.inventory[item.id] - quantity
        userstats.economy.money += item.sellPrice * quantity

        updateUser(userstats)

        let embed = new Discord.MessageEmbed()
            .setTitle(`${getEmoji(client, item.name.toLowerCase())} ${item.name.toUpperCase()} venduto/a`)
            .setColor(colors.green)
            .setDescription(`
Item ${quantity == 1 ? "venduto" : "venduti"} da ${interaction.user.toString()}

Quantity: **${quantity}**
:coin: **Total profit: ${humanize(item.sellPrice * quantity)}$**

_Ora hai ${humanize(userstats.economy.money)}$_`)
            .setFooter({ text: `Nell'inventario ora ne hai ${userstats.economy.inventory[item.id] ? userstats.economy.inventory[item.id] : "0"}` })

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
