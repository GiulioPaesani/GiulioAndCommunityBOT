module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("buy")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        var item = require("../../config/items.json").find(x => x.id == button.customId.split(",")[2])
        if (!item) return

        var embed = new Discord.MessageEmbed()
            .setTitle("Buy " + item.name.toUpperCase())
            .setColor(item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`
Unit cost: ${item.price}$
Amount: **1**

:coin: Total cost: **${item.price}$**
_Hai ${userstats.money}$ - Rimanenti: ${userstats.money - item.price}$_`)
            .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

        var button1 = new Discord.MessageButton()
            .setLabel("Annulla")
            .setCustomId(`annullaShop,${button.user.id},${item.id}`)
            .setStyle("DANGER")

        var button2 = new Discord.MessageButton()
            .setCustomId(`-buy,${button.user.id},${item.id},1`)
            .setStyle("PRIMARY")
            .setEmoji("🔽")
            .setDisabled()

        var button3 = new Discord.MessageButton()
            .setCustomId(`+buy,${button.user.id},${item.id},1`)
            .setStyle("PRIMARY")
            .setEmoji("🔼")

        if (userstats.money < (item.price * 2)) {
            button3
                .setLabel("(No money)")
                .setDisabled()
        }

        var button4 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaBuy,${button.user.id},${item.id},1`)
            .setStyle("SUCCESS")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        button.message.edit({ embeds: [embed], components: [row] })
    },
};