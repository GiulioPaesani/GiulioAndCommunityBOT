const { createCanvas, loadImage, registerFont } = require('canvas')

module.exports = {
    name: "shop",
    aliases: ["negozio"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Shop completo con tutti gli oggetti da comprare o vendere",
    syntax: "!shop (item)",
    category: "ranking",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var embed = new Discord.MessageEmbed()
                .setTitle(":shopping_cart: SHOP :shopping_cart:")
                .setDescription(`Tutti gli oggetti che puoi comprare o vendere attraverso i tuoi Coins`)
                .addField("Categorie", `
I comandi sono divisi nelle seguenti categorie:
:desktop: Tecnology
:poultry_leg: Food
:house: Home
:pickup_truck: Mezzi di trasporto
:shirt: Abbigliamento

_Seleziona la categoria dal menù qua sotto_`)
                .addField("More info", `
Con \`!shop [item]\` puoi avere più **informazioni** riguardo un oggetto, quando costa **comprarlo**, **venderlo**, il suo **id** e altro
Utilizza invece i comandi \`!buy [item]\` e \`!sell [item]\` per comprare o vendere più velocemente
`)

            var option1 = new disbut.MessageMenuOption()
                .setLabel('Technology')
                .setEmoji('🖥️')
                .setValue('shopTechnology')

            var option2 = new disbut.MessageMenuOption()
                .setLabel('Food')
                .setEmoji('🍗')
                .setValue('shopFood')

            var option3 = new disbut.MessageMenuOption()
                .setLabel('Home')
                .setEmoji('🏠')
                .setValue('shopHome')

            var option4 = new disbut.MessageMenuOption()
                .setLabel('Mezzi di trasporto')
                .setEmoji('🛻')
                .setValue('shopMezziTrasporto')

            var option5 = new disbut.MessageMenuOption()
                .setLabel('Abbigliamento')
                .setEmoji('👕')
                .setValue('shopAbbigliamento')

            let select = new disbut.MessageMenu()
                .setID(`shopMenu,${message.author.id}`)
                .setPlaceholder('Select category...')
                .setMaxValues(1)
                .setMinValues(1)
                .addOption(option1)
                .addOption(option2)
                .addOption(option3)
                .addOption(option4)
                .addOption(option5)

            message.channel.send(embed, select)
                .catch(() => { return })
        }
        else {
            var oggetto = args.join(" ").toLowerCase()

            var item = require("../../config/items.json").find(x => x.name.toLowerCase() == oggetto || x.id == oggetto || x.id == oggetto.slice(1) || x.alias.includes(oggetto))

            if (!item) {
                return botCommandMessage(message, "Error", "Oggetto non trovato", "Hai inserito un oggetto non valido o non esistente", property)
            }

            var userstats = userstatsList.find(x => x.id == message.author.id);
            if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

            if (!item.priviled || (item.priviled && userstats.level >= item.priviled)) {
                var button1 = new disbut.MessageButton()
                    .setLabel("Sell")
                    .setID(`sell,${message.author.id},${item.id}`)
                    .setStyle("blurple")

                var button2 = new disbut.MessageButton()
                    .setLabel("Buy")
                    .setID(`buy,${message.author.id},${item.id}`)
                    .setStyle("green")

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

                var row = new disbut.MessageActionRow()
                    .addComponent(button1)
                    .addComponent(button2)

                var canvas = await createCanvas(400, 400)
                var ctx = await canvas.getContext('2d')

                ctx.fillStyle = item.category == "technology" ? "#999999" : item.category == "food" ? "#db8616" : item.category == "home" ? "#1dbfaa" : item.category == "mezziTrasporto" ? "#c43812" : "#2683c9";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                var img = await loadImage(`https://cdn.discordapp.com/emojis/${item.icon.split(":")[2].slice(0, -1)}.png?size=128`)
                ctx.drawImage(img, canvas.width / 2 - 250 / 2, canvas.height / 2 - 250 / 2, 250, 250)

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

                message.channel.send({ embed: embed, files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: row })
                    .catch(() => { return })
            }
            else {
                var button1 = new disbut.MessageButton()
                    .setLabel("Sell")
                    .setID(`sell,${message.author.id.id},${item.id}`)
                    .setStyle("blurple")

                var button2 = new disbut.MessageButton()
                    .setLabel("Buy (Not unlocked)")
                    .setID(`buy,${message.author.id.id},${item.id}`)
                    .setStyle("green")
                    .setDisabled()

                if (!userstats.inventory[item.id] || userstats.inventory[item.id] == 0) {
                    button1
                        .setDisabled()
                        .setLabel("Sell (No items in inventory)")
                }

                var row = new disbut.MessageActionRow()
                    .addComponent(button1)
                    .addComponent(button2)

                var canvas = await createCanvas(400, 400)
                var ctx = await canvas.getContext('2d')

                ctx.fillStyle = "#757575";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                var img = await loadImage(`https://cdn.discordapp.com/emojis/${item.iconUnlocked.split(":")[2].slice(0, -1)}.png?size=128`)
                ctx.drawImage(img, canvas.width / 2 - 250 / 2, canvas.height / 2 - 250 / 2, 250, 250)

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

                message.channel.send({ embed: embed, files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')], components: row })
                    .catch(() => { return })
            }

        }
    },
};