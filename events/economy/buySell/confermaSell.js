module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("confermaSell")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var userstats = userstatsList.find(x => x.id == button.clicker.user.id);
        if (!userstats) return

        var item = require("../../../config/items.json").find(x => x.id == button.id.split(",")[2])
        if (!item) return

        var amount = parseInt(button.id.split(",")[3])

        if (userstats.inventory[item.id] && userstats.inventory[item.id] < amount) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":credit_card: Sell items :credit_card:")
            .setColor("#e31705")
            .setDescription(`[Message link](https://discord.com/channels/${button.message.guild.id}/${button.message.channel.id}/${button.message.id})`)
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${button.clicker.user.toString()} - ID: ${button.clicker.user.id}`)
            .addField("Item", `${item.icon} ${item.name} (Unit profit: ${item.sellPrice}$)`)
            .addField("Count", `${amount} (Now ${userstats.inventory[item.id] - amount} in inventory)`)
            .addField("Total profit", `${item.sellPrice * amount}$`)
            .addField("User economy", `
Old: ${userstats.money}$
`)

        userstats.inventory[item.id] -= amount
        userstats.money += item.sellPrice * amount

        embed.fields[5].value += `New: ${userstats.money}$`

        if (!isMaintenance())
            client.channels.cache.get(log.ranking.purchaseItems).send(embed)

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var embed = new Discord.MessageEmbed()
            .setTitle(item.name.toUpperCase())
            .setColor("#17d42a")
            .setThumbnail("attachment://canvas.png")
            .setDescription(`
Item ${amount == 1 ? "venduto" : "venduti"} da ${button.clicker.user.toString()}

Amount: **${amount}**
:coin: **Total profit: ${item.sellPrice * amount}$**
_Ora hai ${userstats.money}$_`)
            .setFooter(`Nell'inventario: ${userstats.inventory[item.id] ? userstats.inventory[item.id] : "0"}`)

        button.message.edit(embed, null)
    },
};