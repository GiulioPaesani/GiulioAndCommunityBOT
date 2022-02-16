module.exports = {
    name: "inventory",
    aliases: ["inventario", "inv"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Tutta la lista degli oggetti che possiede un utente",
    syntax: "!inventory (user)",
    category: "ranking",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        if (!args[0]) {
            var utente = message.author;
        }
        else {
            var utente = message.mentions.users?.first()
            if (!utente) {
                var utente = await getUser(args.join(" "))
            }
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utente.user) utente = utente.user

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non un bot", "Non puoi avere l'inventario di un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

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

        if (totItems == 0) {
            var embed = new Discord.MessageEmbed()
                .setTitle(":handbag: Inventory :handbag:")
                .setDescription(`Tutto l'inventario di ${utente.toString()} con gli oggetti che possiede

_Oggetti totali: ${totItems}_`)
                .setFooter(`Coins: ${userstats.money}$`)

            message.channel.send({ embeds: [embed] })
                .catch(() => { })
            return
        }

        var totPage = Math.ceil(totItems / 20)
        var page = 1;

        var embed = new Discord.MessageEmbed()
            .setTitle(":handbag: Inventory :handbag:")
            .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
            .setDescription(`Tutto l'inventario di ${utente.toString()} con gli oggetti che possiede

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
            .setCustomId(`indietroInv,${message.author.id},${utente.id},${page}`)
            .setStyle("PRIMARY")

        if (page == 1)
            button1.setDisabled()

        var button2 = new Discord.MessageButton()
            .setEmoji("▶️")
            .setCustomId(`avantiInv,${message.author.id},${utente.id},${page}`)
            .setStyle("PRIMARY")

        if (page + 1 > totPage)
            button2.setDisabled()

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        if (totPage > 1)
            message.channel.send({ embeds: [embed], components: [row] })
                .catch(() => { })
        else
            message.channel.send({ embeds: [embed] })
                .catch(() => { })
    },
};
