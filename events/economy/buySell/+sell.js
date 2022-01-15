module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("+sell")) return

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
        if (!userstats) return

        var item = require("../../../config/items.json").find(x => x.id == button.id.split(",")[2])
        if (!item) return

        var amount = parseInt(button.id.split(",")[3])
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

        var button1 = new disbut.MessageButton()
            .setLabel(button.message.components[0].components[0].label)
            .setID(`annullaShop,${button.clicker.user.id},${item.id}`)
            .setStyle("red")

        var button2 = new disbut.MessageButton()
            .setID(`-sell,${button.clicker.user.id},${item.id},${amount}`)
            .setStyle("blurple")
            .setEmoji("🔽")

        var button3 = new disbut.MessageButton()
            .setID(`+sell,${button.clicker.user.id},${item.id},${amount}`)
            .setStyle("blurple")
            .setEmoji("🔼")

        if (userstats.inventory[item.id] < amount + 1) {
            button3
                .setLabel("(No enough items in inventory)")
                .setDisabled()
        }

        var button4 = new disbut.MessageButton()
            .setLabel("Conferma")
            .setID(`confermaSell,${button.clicker.user.id},${item.id},${amount}`)
            .setStyle("green")

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)
            .addComponent(button3)
            .addComponent(button4)

        button.message.edit(embed, row)
    },
};