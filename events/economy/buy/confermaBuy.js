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

        if (!interaction.customId.startsWith("confermaBuy")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let item = items.find(x => x.id == interaction.customId.split(",")[2])
        let quantity = parseInt(interaction.customId.split(",")[3])

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        if (userstats.economy.money < item.price * quantity) {
            let embed = new Discord.MessageEmbed()
                .setTitle("Monete non sufficienti")
                .setColor(colors.gray)
                .setDescription("Non hai abbastanza monete per comprare questo oggetto")

            interaction.message.edit({ embeds: [embed], components: [] })
            return
        }

        userstats.economy.inventory[item.id] = (userstats.economy.inventory[item.id] ? userstats.economy.inventory[item.id] : 0) + quantity
        userstats.economy.money -= item.price * quantity

        updateUser(userstats)

        let embed = new Discord.MessageEmbed()
            .setTitle(`${getEmoji(client, item.name.toLowerCase())} ${item.name.toUpperCase()} acquistato/a`)
            .setColor(colors.green)
            .setDescription(`
Item ${quantity == 1 ? "acquistato" : "acquistati"} da ${interaction.user.toString()}

Quantity: **${quantity}**
:coin: Total cost: **${humanize(item.price * quantity)}$**

_Ora hai ${humanize(userstats.economy.money)}$_`)
            .setFooter({ text: `Nell'inventario ora ne hai ${userstats.economy.inventory[item.id] ? userstats.economy.inventory[item.id] : "0"}` })

        interaction.message.edit({ embeds: [embed], components: [] })
    },
};
