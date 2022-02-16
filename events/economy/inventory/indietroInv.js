module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("indietroInv")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.customId.split(",")[2]);
        if (!userstats) return

        var totItems = 0
        var items = []

        if (userstats.inventory) {
            for (var index in userstats.inventory) {
                if (userstats.inventory[index] && userstats.inventory[index] > 0) {
                    totItems++
                    items.push({ item: require("../../../config/items.json").find(x => x.id == index), amount: userstats.inventory[index] })
                }
            }
        }

        var totPage = Math.ceil(totItems / 20)
        var page = parseInt(button.customId.split(",")[3]) - 1;
        if (page == 0) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":handbag: Inventory :handbag:")
            .setDescription(`Tutto l'inventario di <@${button.customId.split(",")[2]}> con gli oggetti che possiedi

_Oggetti totali: ${totItems}_`)
            .setFooter(totPage > 1 ? `Coins: ${userstats.money}$ - Page ${page}/${totPage}` : `Coins: ${userstats.money}$`)

        for (var i = 20 * (page - 1); i < 20 * page; i++) {
            if (items[i]) {
                embed
                    .addField(`${items[i].item.icon} ${items[i].item.name}`, `ID: \`#${items[i].item.id}\`\rQuantity: ${items[i].amount}`, true)
            }
        }

        var button1 = new Discord.MessageButton()
            .setEmoji("◀️")
            .setCustomId(`indietroInv,${button.user.id},${button.customId.split(",")[2]},${page}`)
            .setStyle("PRIMARY")

        if (page == 1)
            button1.setDisabled()

        var button2 = new Discord.MessageButton()
            .setEmoji("▶️")
            .setCustomId(`avantiInv,${button.user.id},${button.customId.split(",")[2]},${page}`)
            .setStyle("PRIMARY")

        if (page + 1 > totPage)
            button2.setDisabled()

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        button.message.edit({ embeds: [embed], components: [row] })
    },
};