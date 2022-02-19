const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
    name: "sell",
    aliases: ["vendi", "vendita"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Vendi un qualsiasi oggetto dal negozio",
    syntax: "!sell [item]",
    category: "ranking",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            return botCommandMessage(message, "Error", "Oggetto non trovato", "Hai inserito un oggetto non valido o non esistente", property)
        }

        var oggetto = args.join(" ").toLowerCase()

        var item = require("../../config/items.json").find(x => x.name.toLowerCase() == oggetto || x.id == oggetto || x.id == oggetto.slice(1) || x.alias.includes(oggetto))

        if (!item) {
            return botCommandMessage(message, "Error", "Oggetto non trovato", "Hai inserito un oggetto non valido o non esistente", property)
        }

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var amount = 0
        if (userstats.inventory[item.id] && userstats.inventory[item.id] > 0) amount = 1

        var canvas = await createCanvas(400, 400)
        var ctx = await canvas.getContext('2d')

        ctx.fillStyle = item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var img = await loadImage(`https://cdn.discordapp.com/emojis/${item.icon.split(":")[2].slice(0, -1)}.png?size=128`)
        ctx.drawImage(img, canvas.width / 2 - 250 / 2, canvas.height / 2 - 250 / 2, 250, 250)

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
            .setLabel("Info prodotto")
            .setCustomId(`annullaShop,${message.author.id},${item.id}`)
            .setStyle("DANGER")

        var button2 = new Discord.MessageButton()
            .setCustomId(`-sell,${message.author.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setDisabled()
            .setEmoji("🔽")

        var button3 = new Discord.MessageButton()
            .setCustomId(`+sell,${message.author.id},${item.id},${amount}`)
            .setStyle("PRIMARY")
            .setEmoji("🔼")

        if (!userstats.inventory[item.id] || userstats.inventory[item.id] <= amount) {
            button3
                .setLabel("(No items)")
                .setDisabled()
        }

        var button4 = new Discord.MessageButton()
            .setLabel("Conferma")
            .setCustomId(`confermaSell,${message.author.id},${item.id},${amount}`)
            .setStyle("SUCCESS")

        if (amount == 0)
            button4.setDisabled()

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        message.channel.send({ embeds: [embed], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: [row] })
            .catch(() => { })
    },
};
