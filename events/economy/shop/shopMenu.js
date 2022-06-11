const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const items = require("../../../config/ranking/items.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUser } = require("../../../functions/database/getUser");
const { addUser } = require("../../../functions/database/addUser");
const { humanize } = require("../../../functions/general/humanize");
const { hasSufficientLevels } = require("../../../functions/leveling/hasSufficientLevels");
const { getEmoji } = require("../../../functions/general/getEmoji");

module.exports = {
    name: `interactionCreate`,
    client: "ranking",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (isMaintenance(interaction.user.id)) return

        if (!interaction.customId.startsWith("shopMenu")) return

        interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Menu non tuo", "Questo menu è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let userstats = getUser(interaction.user.id)
        if (!userstats) userstats = addUser(interaction.member)[0]

        let embed = new Discord.MessageEmbed()
            .setDescription(`Utilizza i comandi \`/buy [item]\` e \`/sell [item]\` per comprare o vendere un oggetto`)
        let category;

        switch (interaction.values[0]) {
            case "shopTechnology": {
                category = "technology"
                embed
                    .setTitle("💾 TECHNOLOGY items 💾")
                    .setColor("#3ec2fa")
            } break
            case "shopFood": {
                category = "food"
                embed
                    .setTitle("🍗 FOOD items 🍗")
                    .setColor("#db8616")
            } break
            case "shopHome": {
                category = "home"
                embed
                    .setTitle("🏠 HOME items 🏠")
                    .setColor("#1dbfaa")
            } break
            case "shopMezziTrasporto": {
                category = "mezziTrasporto"
                embed
                    .setTitle("🚚 TRANSPORT items 🚚")
                    .setColor("#c43812")
            } break
            case "shopAbbigliamento": {
                category = "abbigliamento"
                embed
                    .setTitle("👕 CLOTHING items 👕")
                    .setColor("#2683c9")
            } break
        }

        items.filter(x => x.category == category).forEach(item => {
            embed
                .addField(`${!item.priviled || (item.priviled && hasSufficientLevels(client, userstats, item.priviled)) ? getEmoji(client, item.name.toLowerCase()) : getEmoji(client, `${item.name.toLowerCase()}Unlocked`)} ${item.name}`, !item.priviled || (item.priviled && hasSufficientLevels(client, userstats, item.priviled)) ? `
Price: ${humanize(item.price)}$
ID: \`#${item.id}\`` : `
_Sblocca con \n${client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${item.priviled}`).toString()}_`, true)
        })

        let select = new Discord.MessageSelectMenu()
            .setCustomId(`shopMenu,${interaction.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Technology",
                emoji: "💾",
                value: "shopTechnology",
            })
            .addOptions({
                label: "Food",
                emoji: "🍗",
                value: "shopFood",
            })
            .addOptions({
                label: "Home",
                emoji: "🏠",
                value: "shopHome",
            })
            .addOptions({
                label: "Mezzi di trasporto",
                emoji: "🚚",
                value: "shopMezziTrasporto",
            })
            .addOptions({
                label: "Abbigliamento",
                emoji: "👕",
                value: "shopAbbigliamento",
            })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};
