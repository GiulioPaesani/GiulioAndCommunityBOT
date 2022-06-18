const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const items = require("../../config/ranking/items.json")
const { getUser } = require("../../functions/database/getUser")
const { addUser } = require("../../functions/database/addUser")
const { replyMessage } = require("../../functions/general/replyMessage")
const { humanize } = require("../../functions/general/humanize")
const { hasSufficientLevels } = require("../../functions/leveling/hasSufficientLevels")
const { getEmoji } = require("../../functions/general/getEmoji")

module.exports = {
    name: "shop",
    description: "Shop completo con tutti gli oggetti da comprare o vendere",
    permissionLevel: 0,
    requiredLevel: 0,
    cooldown: 15,
    syntax: "/shop (category)",
    category: "ranking",
    data: {
        options: [
            {
                name: "category",
                description: "Categoria degli oggetti da visualizzare",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "💾 Technology",
                        value: "technology"
                    },
                    {
                        name: "🍗 Food",
                        value: "food"
                    },
                    {
                        name: "🏠 Home",
                        value: "home"
                    },
                    {
                        name: "🚚 Mezzo di trasporto",
                        value: "mezziTrasporto"
                    },
                    {
                        name: "👕 Abbigliamento",
                        value: "abbigliamento"
                    }
                ]
            },
            {
                name: "item",
                description: "Oggetto specifico del quale si vogliono sapere le informazioni",
                type: "STRING",
                required: false,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let category = interaction.options.getString("category")
        let item = interaction.options.getString("item")

        if (category || !item) {
            let embed = new Discord.MessageEmbed()

            switch (category) {
                case "technology": {
                    embed
                        .setTitle("💾 TECHNOLOGY items 💾")
                        .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
                        .setColor("#3ec2fa")
                } break
                case "food": {
                    embed
                        .setTitle("🍗 FOOD items 🍗")
                        .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
                        .setColor("#db8616")
                } break
                case "home": {
                    embed
                        .setTitle("🏠 HOME items 🏠")
                        .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
                        .setColor("#1dbfaa")
                } break
                case "mezziTrasporto": {
                    embed
                        .setTitle("🚚 TRANSPORT items 🚚")
                        .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
                        .setColor("#c43812")
                } break
                case "abbigliamento": {
                    embed
                        .setTitle("👕 CLOTHING items 👕")
                        .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
                        .setColor("#2683c9")
                } break
                default: {
                    embed
                        .setTitle(":shopping_cart: SHOP :shopping_cart:")
                        .setDescription(`Tutti gli oggetti che puoi comprare o vendere attraverso le tue monete`)
                        .addField("Categorie", `
I comandi sono divisi nelle seguenti categorie:
:floppy_disk: Tecnology
:poultry_leg: Food
:house: Home
:truck: Mezzi di trasporto
:shirt: Abbigliamento

_Seleziona la categoria dal menù qua sotto_

Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto
`)
                } break
            }

            let userstats = getUser(interaction.user.id)
            if (!userstats) userstats = addUser(interaction.member)[0]

            if (category) {
                items.filter(x => x.category == category).forEach(item => {
                    embed
                        .addField(`${!item.priviled || (item.priviled && hasSufficientLevels(client, userstats, item.priviled)) ? getEmoji(client, item.name.toLowerCase()) : getEmoji(client, `${item.name.toLowerCase()}Unlocked`)} ${item.name}`, !item.priviled || (item.priviled && hasSufficientLevels(client, userstats, item.priviled)) ? `
Price: ${humanize(item.price)}$
ID: \`#${item.id}\`` : `
_Sblocca con \n${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${item.priviled}`).toString()}_`, true)
                })
            }

            let select = new Discord.MessageSelectMenu()
                .setCustomId(`shopMenu,${interaction.user.id}`)
                .setPlaceholder('Select category...')
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions({
                    label: "Technology",
                    emoji: "💾",
                    value: "shopTechnology",
                })
                .addOptions({
                    label: "Food",
                    emoji: "🍗",
                    value: "shopFood",
                })
                .addOptions({
                    label: "Home",
                    emoji: "🏠",
                    value: "shopHome",
                })
                .addOptions({
                    label: "Mezzi di trasporto",
                    emoji: "🚚",
                    value: "shopMezziTrasporto",
                })
                .addOptions({
                    label: "Abbigliamento",
                    emoji: "👕",
                    value: "shopAbbigliamento",
                })

            let row = new Discord.MessageActionRow()
                .addComponents(select)

            interaction.reply({ embeds: [embed], components: [row] })
        }
        else {
            item = items.find(x => x.name.toLowerCase() == item.toLowerCase() || x.id == item.toLowerCase() || x.id == item.toLowerCase().slice(1) || x.alias.includes(item.toLowerCase()))

            if (!item) {
                return replyMessage(client, interaction, "Error", "Oggetto non trovato", "Inserisci un oggetto valido", comando)
            }

            let userstats = getUser(interaction.user.id)
            if (!userstats) userstats = addUser(interaction.member)[0]

            let embed = new Discord.MessageEmbed()
                .setTitle(`${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? getEmoji(client, `${item.name.toLowerCase()}Unlocked`) : getEmoji(client, item.name.toLowerCase())} ${item.name.toUpperCase()} ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? " - Not unlocked" : ""}`)
                .setColor(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "#757575" : item.category == "technology" ? "#3ec2fa" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
                .setDescription(`
${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? `_Sblocca questo oggetto con ${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${item.priviled}`).toString()}_` : ""}
Informazioni di compra-vendita per questo oggetto`)
                .addField(`Price: ${humanize(item.price)}$`, `
Selling price: ${humanize(item.sellPrice)}$
ID: \`#${item.id}\`
`)
                .setFooter({ text: `Nell'inventario ne hai ${userstats.economy.inventory[item.id] ? userstats.economy.inventory[item.id] : "0"}` })

            let button1 = new Discord.MessageButton()
                .setLabel(`Sell ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "(Not unlocked)" : !userstats.economy.inventory[item.id] || userstats.economy.inventory[item.id] == 0 ? "(No items in inventory)" : ""}`)
                .setCustomId(`sell,${interaction.user.id},${item.id}`)
                .setStyle("PRIMARY")
                .setDisabled(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? true : !userstats.economy.inventory[item.id] || userstats.economy.inventory[item.id] == 0 ? true : false)

            let button2 = new Discord.MessageButton()
                .setLabel(`Buy ${item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? "(Not unlocked)" : userstats.economy.money < item.price ? "(No money)" : ""}`)
                .setCustomId(`buy,${interaction.user.id},${item.id}`)
                .setStyle("SUCCESS")
                .setDisabled(item.priviled && !hasSufficientLevels(client, userstats, item.priviled) ? true : userstats.economy.money < item.price ? true : false)

            let row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            interaction.reply({ embeds: [embed], components: [row] })
        }
    },
};