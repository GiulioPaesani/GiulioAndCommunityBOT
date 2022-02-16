module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("confermaSell")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.user.id);
        if (!userstats) return

        var item = require("../../../config/items.json").find(x => x.id == button.customId.split(",")[2])
        if (!item) return

        var amount = parseInt(button.customId.split(",")[3])

        if (userstats.inventory[item.id] && userstats.inventory[item.id] < amount) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":credit_card: Sell items :credit_card:")
            .setColor("#e31705")
            .setDescription(button.message.guild ? `[Message link](https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id})` : "")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${button.user.toString()} - ID: ${button.user.id}`)
            .addField("Item", `${item.icon} ${item.name} (Unit profit: ${item.sellPrice}$)`)
            .addField("Count", `${amount} (Now ${userstats.inventory[item.id] - amount} in inventory)`)
            .addField("Total profit", `${item.sellPrice * amount}$`)
            .addField("User economy", `
Old: ${userstats.money}$
`)
        userstats.inventory[item.id] = userstats.inventory[item.id] - amount
        userstats.money += item.sellPrice * amount

        embed.fields[5].value += `New: ${userstats.money}$`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.purchaseItems).send({ embeds: [embed] })

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var embed = new Discord.MessageEmbed()
            .setTitle(item.name.toUpperCase())
            .setColor("#17d42a")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`
Item ${amount == 1 ? "venduto" : "venduti"} da ${button.user.toString()}

Amount: **${amount}**
:coin: **Total profit: ${item.sellPrice * amount}$**
_Ora hai ${userstats.money}$_`)
            .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

        button.message.edit({ embeds: [embed], components: [] })
    },
};