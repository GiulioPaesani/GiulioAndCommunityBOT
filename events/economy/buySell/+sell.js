module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("+sell")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        var item = require("../../../config/items.json").find(x => x.id == button.customId.split(",")[2])
        if (!item) return

        var amount = parseInt(button.customId.split(",")[3])
        amount++

        var embed = new Discord.MessageEmbed()
            .setTitle("Sell " + item.name.toUpperCase())
            .setColor(item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`
Unit profit: ${item.sellPrice}$
Amount: **${amount}**

:coin: Total profit: **${item.sellPrice * amount}$**
_Hai ${userstats.money}$ - Con guadagno: ${userstats.money + (item.sellPrice * amount)}$_`)
            .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

        var button1 = new Discord.MessageButton()
            .setLabel(button.message.components[0].components[0].label)
            .setCustomId(`annullaShop,${button.user.id},${item.id}`)
            .setStyle("DANGER")

        var button2 = new Discord.MessageButton()
            .setCustomId(`-sell,${button.user.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setEmoji("🔽")

        var button3 = new Discord.MessageButton()
            .setCustomId(`+sell,${button.user.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setEmoji("🔼")

        if (userstats.inventory[item.id] < amount + 1) {
            button3
                .setLabel("(No enough items in inventory)")
                .setDisabled()
        }

        var button4 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaSell,${button.user.id},${item.id},${amount}`)
            .setStyle("SUCCESS")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        button.message.edit({ embeds: [embed], components: [row] })
    },
};