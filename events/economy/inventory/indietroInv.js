module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("indietroInv")) return

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var userstats = userstatsList.find(x => x.id == button.id.split(",")[2]);
        if (!userstats) return

        for (var i = 0; i < 22; i++) {
            userstats.inventory[require("../../config/items.json")[i].id] = 2
        }

        var totItems = 0
        var items = []

        if (userstats.inventory) {
            for (var index in userstats.inventory) {
                if (userstats.inventory[index] && userstats.inventory[index] > 0) {
                    totItems++
                    items.push({ item: require("../../config/items.json").find(x => x.id == index), amount: userstats.inventory[index] })
                }
            }
        }

        var totPage = Math.ceil(totItems / 20)
        var page = parseInt(button.id.split(",")[3]) - 1;
        if (page == 0) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":handbag: Inventory :handbag:")
            .setDescription(`Tutto l'inventario di <@${button.id.split(",")[2]}> con gli oggetti che possiedi

_Oggetti totali: ${totItems}_`)
            .setFooter(totPage > 1 ? `Coins: ${userstats.money}$ - Page ${page}/${totPage}` : `Coins: ${userstats.money}$`)

        for (var i = 20 * (page - 1); i < 20 * page; i++) {
            if (items[i]) {
                embed
                    .addField(`${items[i].item.icon} ${items[i].item.name}`, `ID: \`#${items[i].item.id}\`\rQuantity: ${items[i].amount}`, true)
            }
        }

        var button1 = new disbut.MessageButton()
            .setEmoji("◀️")
            .setID(`indietroInv,${button.clicker.user.id},${button.id.split(",")[2]},${page}`)
            .setStyle("blurple")

        if (page == 1)
            button1.setDisabled()

        var button2 = new disbut.MessageButton()
            .setEmoji("▶️")
            .setID(`avantiInv,${button.clicker.user.id},${button.id.split(",")[2]},${page}`)
            .setStyle("blurple")

        if (page + 1 > totPage)
            button2.setDisabled()

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        button.message.edit(embed, row)
    },
};