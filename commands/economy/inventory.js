const Discord = require("discord.js")
const settings = require("../../config/general/settings.json")
const items = require("../../config/ranking/items.json")
const colors = require("../../config/general/colors.json")
const { replyMessage } = require("../../functions/general/replyMessage")
const { humanize } = require("../../functions/general/humanize")
const { addUser } = require("../../functions/database/addUser")
const { getUser } = require("../../functions/database/getUser")
const { getEmoji } = require("../../functions/general/getEmoji")
const { getTaggedUser } = require("../../functions/general/getTaggedUser")

module.exports = {
    name: "inventory",
    description: "Tutta la lista degli oggetti che possiede un utente",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/inventory (user)",
    category: "ranking",
    client: "ranking",
    data: {
        options: [
            {
                name: "user",
                description: "Utente di cui vedere l'inventario",
                type: "STRING",
                required: false,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(client, interaction, comando) {
        let utente = await getTaggedUser(client, interaction.options.getString("user")) || interaction.user

        if (utente.bot) {
            return replyMessage(client, interaction, "Warning", "Non un bot", "Non puoi vedere l'inventario di un bot", comando)
        }

        let userstats = getUser(utente.id)
        if (!userstats) userstats = addUser(interaction.guild.members.cache.get(utente.id) || utente)[0]

        let totItems = 0
        let userItems = []

        for (let index in userstats.economy.inventory) {
            if (userstats.economy.inventory[index] && userstats.economy.inventory[index] > 0) {
                totItems += userstats.economy.inventory[index]
                userItems.push({ item: items.find(x => x.id == index), quantity: userstats.economy.inventory[index] })
            }
        }

        let totPage = Math.ceil(userItems.length / 9)
        let page = 1;

        let embed = new Discord.MessageEmbed()
            .setTitle(":handbag: Inventory :handbag:")
            .setColor(colors.purple)
            .setDescription(`Tutto l'inventario di ${utente.toString()} con gli oggetti che possiede
_Oggetti totali: ${totItems}_`)
            .setFooter({ text: totPage > 1 ? `Coins: ${humanize(userstats.economy.money)}$ - Page ${page}/${totPage}` : `Coins: ${humanize(userstats.economy.money)}$` })

        for (let i = 9 * (page - 1); i < 9 * page; i++) {
            if (userItems[i]) {
                embed
                    .addField(`${getEmoji(client, userItems[i].item.name.toLowerCase())} ${userItems[i].item.name}`, `ID: \`#${userItems[i].item.id}\`\nQuantity: ${userItems[i].quantity}`, true)
            }
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroInv,${interaction.user.id},${utente.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiInv,${interaction.user.id},${utente.id},${page}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [embed], components: totPage > 1 ? [row] : [] })


    },
};