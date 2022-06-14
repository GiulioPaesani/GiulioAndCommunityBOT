const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const items = require("../../config/ranking/items.json")
const { getEmoji } = require("../../functions/general/getEmoji")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { replyMessage } = require("../../functions/general/replyMessage")
const { humanize } = require("../../functions/general/humanize")
const { hasSufficientLevels } = require("../../functions/leveling/hasSufficientLevels")

module.exports = {
    name: "sell",
    description: "Vendi un qualsiasi oggetto dal tuo inventarios",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/sell [item] (quantity)",
    category: "ranking",
    client: "ranking",
    data: {
        options: [
            {
                name: "item",
                description: "Oggetto che si vuole vendere",
                type: "STRING",
                required: true,
                autocomplete: true
            },
            {
                name: "quantity",
                description: "Quantità di oggetti che si vogliono vendere",
                type: "INTEGER",
                minValue: 1,
                required: false,
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let item = interaction.options.getString("item")
        let quantity = interaction.options.getInteger("quantity") || 1

        item = items.find(x => x.name.toLowerCase() == item.toLowerCase() || x.id == item.toLowerCase() || x.id == item.toLowerCase().slice(1) || x.alias.includes(item.toLowerCase()))

        if (!item) {
            return replyMessage(client, interaction, "Error", "Oggetto non trovato", "Inserisci un oggetto valido", comando)
        }

        let userstats = getUser(interaction.user.id)
        if (!userstats) userstats = addUser(interaction.member)[0]

        let embed = new Discord.MessageEmbed()
            .setTitle(`Sell  ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? getEmoji(client, `${item.name.toLowerCase()}Unlocked`) : getEmoji(client, item.name.toLowerCase())} ${item.name.toUpperCase()} ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "- Not unlocked" : ""}`)
            .setColor(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "#757575" : item.category == "technology" ? "#3ec2fa" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
            .setDescription(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? `_Sblocca questo oggetto con ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${item.priviled}`).toString()}_` : `
Quantity: **${quantity}**
Profit: **${humanize(item.sellPrice)}$**

:coin: Total profit: **${humanize(item.sellPrice * quantity)}$**`)
            .setFooter({ text: `Nell'inventario ne hai ${userstats.economy.inventory[item.id] ? userstats.economy.inventory[item.id] : "0"}` })

        let button1 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Down"))
            .setCustomId(`-sell,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("PRIMARY")

        let button2 = new Discord.MessageButton()
            .setEmoji(getEmoji(client, "Up"))
            .setCustomId(`+sell,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("PRIMARY")

        let button3 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaSell,${interaction.user.id},${item.id},${quantity}`)
            .setStyle("SUCCESS")

        if (item.priviled && !hasSufficientLevels(client, userstats, item.priviled)) {
            button1.setDisabled()
            button2.setDisabled()
        }
        else {
            if (quantity <= 1) {
                button1.setDisabled()
            }

            if (!userstats.economy.inventory[item.id] || userstats.economy.inventory[item.id] < quantity + 1) {
                button2
                    .setLabel("(No items in inventory)")
                    .setDisabled()
            }
            if (!userstats.economy.inventory[item.id] || userstats.economy.inventory[item.id] < quantity) {
                button3
                    .setLabel("Conferma (No items in inventory)")
                    .setDisabled()
            }
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        let row2 = new Discord.MessageActionRow()
            .addComponents(button3)

        interaction.reply({ embeds: [embed], components: [row, row2] })
    },
};