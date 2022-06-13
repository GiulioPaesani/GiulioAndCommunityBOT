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
    client: "ranking",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("confermaSell")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let item = items.find(x => x.id == interaction.customId.split(",")[2])
        let quantity = parseInt(interaction.customId.split(",")[3])

        let userstats = getUser(interaction.user.id)
        if (!userstats) userstats = addUser(interaction.member)[0]

        if ((userstats.economy.inventory[item.id] || 0) < quantity) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Item non sufficienti")
                .setColor(colors.gray)
                .setDescription("Non hai abbastanza oggetti nell'inventario per venderli")

            interaction.message.edit({ embeds: [embed], components: [] })
            return
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(":credit_card: Sell items :credit_card:")
            .setColor(colors.red)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`)
            .addField(":bust_in_silhouette: Member", `${interaction.user.toString()} - ID: ${interaction.user.id}`)
            .addField(":teddy_bear: Item", `${getEmoji(client, item.name.toLowerCase())} ${item.name} (Unit profit: ${humanize(item.sellPrice)}$)`)
            .addField(":receipt: Count", `${quantity} (Now ${userstats.economy.inventory[item.id] - quantity} in inventory)`)
            .addField(":coin: Total profit", `${humanize(item.sellPrice * quantity)}$`)
            .addField(":moneybag: User economy", `
Old: ${humanize(userstats.economy.money)}$
`)

        userstats.economy.inventory[item.id] = userstats.economy.inventory[item.id] - quantity
        userstats.economy.money += item.sellPrice * quantity

        updateUser(userstats)

        embed.fields[5].value += `New: ${humanize(userstats.economy.money)}$`

        // if (!isMaintenance())
        //     client.channels.cache.get(log.ranking.purchaseItems).send({ embeds: [embed] })

        embed = new Discord.MessageEmbed()
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
