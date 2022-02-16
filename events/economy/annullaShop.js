module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("annullaShop")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        var item = require("../../config/items.json").find(x => x.id == button.customId.split(",")[2])
        if (!item) return

        if (!item.priviled || (item.priviled && userstats.level >= item.priviled)) {
            var button1 = new Discord.MessageButton()
                .setLabel("Sell")
                .setCustomId(`sell,${button.user.id},${item.id}`)
                .setStyle("PRIMARY")

            var button2 = new Discord.MessageButton()
                .setLabel("Buy")
                .setCustomId(`buy,${button.user.id},${item.id}`)
                .setStyle("SUCCESS")

            if (!userstats.inventory[item.id] || userstats.inventory[item.id] == 0) {
                button1
                    .setDisabled()
                    .setLabel("Sell (No items in inventory)")
            }
            if (userstats.money < item.price) {
                button2
                    .setDisabled()
                    .setLabel("Buy (No money)")
            }

            var row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            var embed = new Discord.MessageEmbed()
                .setTitle(`${item.name.toUpperCase()}`)
                .setDescription("Informazioni di compra-vendita per questo oggetto")
                .setThumbnail("attachment://canvas.png")
                .setColor(item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
                .addField(`Price: ${item.price}$`, `
ID: \`#${item.id}\`
Selling price: ${item.sellPrice}$
Category: ${item.category == "technology" ? "Technology" : item.category == "food" ? "Food" : item.category == "home" ? "Home" : item.category == "mezziTrasporto" ? "Mezzi di trasporto" : "Abbigliamento"}`)
                .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

            button.message.edit({ embeds: [embed], components: [row] })
        }
        else {
            var button1 = new Discord.MessageButton()
                .setLabel("Sell")
                .setCustomId(`sell,${button.user.id},${item.id}`)
                .setStyle("PRIMARY")

            var button2 = new Discord.MessageButton()
                .setLabel("Buy (Not unlocked)")
                .setCustomId(`buy,${button.user.id},${item.id}`)
                .setStyle("SUCCESS")
                .setDisabled()

            if (!userstats.inventory[item.id] || userstats.inventory[item.id] == 0) {
                button1
                    .setDisabled()
                    .setLabel("Sell (No items in inventory)")
            }

            var row = new Discord.MessageActionRow()
                .addComponents(button1)
                .addComponents(button2)

            var embed = new Discord.MessageEmbed()
                .setTitle(`${item.name.toUpperCase()} - Not unlocked`)
                .setDescription(`
_Sblocca questo oggetto con <@&${settings.ruoliLeveling["level" + item.priviled]}>_
Informazioni di compra-vendita per questo oggetto`)
                .setThumbnail("attachment://canvas.png")
                .setColor("#757575")
                .addField(`Price: ${item.price}$`, `
ID: \`#${item.id}\`
Selling price: ${item.sellPrice}$
Category: ${item.category == "technology" ? "Technology" : item.category == "food" ? "Food" : item.category == "home" ? "Home" : item.category == "mezziTrasporto" ? "Mezzi di trasporto" : "Abbigliamento"}`)
                .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

            button.message.edit({ embeds: [embed], components: [row] })
        }
    },
};