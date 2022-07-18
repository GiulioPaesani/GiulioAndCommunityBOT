const Discord = require("discord.js")
const items = require("../../../config/ranking/items.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { replyMessage } = require("../../../functions/general/replyMessage");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { getEmoji } = require("../../../functions/general/getEmoji");
const { humanize } = require("../../../functions/general/humanize");
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("+buy")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let item = items.find(x => x.id == interaction.customId.split(",")[2])
        let quantity = parseInt(interaction.customId.split(",")[3])
        quantity++

        let userstats = await getUser(interaction.user.id)
        if (!userstats) userstats = await addUser(interaction.member)

        let embed = new Discord.MessageEmbed()
            .setTitle(`Buy  ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? getEmoji(client, `${item.name.toLowerCase()}Unlocked`) : getEmoji(client, item.name.toLowerCase())} ${item.name.toUpperCase()} ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "- Not unlocked" : ""}`)
            .setColor(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "#757575" : item.category == "technology" ? "#3ec2fa" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
            .setDescription(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? `_Sblocca questo oggetto con ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${item.priviled}`).toString()}_` : `
Quantity: **${quantity}**
Price: **${humanize(item.price)}$**

:coin: Total cost: **${humanize(item.price * quantity)}$**`)
            .setFooter({ text: `Hai ${humanize(userstats.economy.money)}$` })

        let button1 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Down"))
            .setCustomId(`-buy,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("PRIMARY")

        let button2 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Up"))
            .setCustomId(`+buy,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("PRIMARY")

        let button3 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaBuy,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("SUCCESS")

        if (item.priviled && !hasSufficientLevels(client, userstats, item.priviled)) {
            button1.setDisabled()
            button2.setDisabled()
        }
        else {
            if (quantity <= 1) {
                button1.setDisabled()
            }

            if (userstats.economy.money < item.price * (quantity + 1)) {
                button2
                    .setLabel("(No money)")
                    .setDisabled()
            }
            if (userstats.economy.money < item.price * quantity) {
                button3
                    .setLabel("Conferma (No money)")
                    .setDisabled()
            }
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let row2 = new Discord.MessageActionRow()
            .addComponents(button3)

        interaction.message.edit({ embeds: [embed], components: [row, row2] })
    },
};
