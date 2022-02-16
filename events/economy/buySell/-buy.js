module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("-buy")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        var item = require("../../../config/items.json").find(x => x.id == button.customId.split(",")[2])
        if (!item) return

        var amount = parseInt(button.customId.split(",")[3])
        amount--
        if (amount < 1) return

        var embed = new Discord.MessageEmbed()
            .setTitle("Buy " + item.name.toUpperCase())
            .setColor(item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`
Unit cost: ${item.price}$
Amount: **${amount}**

:coin: Total cost: **${item.price * amount}$**
_Hai ${userstats.money}$ - Rimanenti: ${userstats.money - (item.price * amount)}$_`)
            .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

        var button1 = new Discord.MessageButton()
            .setLabel(button.message.components[0].components[0].label)
            .setCustomId(`annullaShop,${button.user.id},${item.id}`)
            .setStyle("DANGER")

        var button2 = new Discord.MessageButton()
            .setCustomId(`-buy,${button.user.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setEmoji("🔽")

        if (amount == 1) button2.setDisabled()

        var button3 = new Discord.MessageButton()
            .setCustomId(`+buy,${button.user.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setEmoji("🔼")

        if (amount >= 99) {
            button3
                .setLabel("(Max 99 items)")
                .setDisabled()
        }
        else if (userstats.money < (item.price * (amount + 1))) {
            button3
                .setLabel("(No money)")
                .setDisabled()
        }

        var button4 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaBuy,${button.user.id},${item.id},${amount}`)
            .setStyle("SUCCESS")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        button.message.edit({ embeds: [embed], components: [row] })
    },
};