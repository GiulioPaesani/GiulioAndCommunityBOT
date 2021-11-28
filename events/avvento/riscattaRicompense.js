module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (settings.inMaintenanceMode)
            if (button.clicker.user.id != settings.idGiulio) return

        if (button.id != "riscattaRicompense") return

        if (!serverstats.avvento[button.clicker.user.id]) {
            serverstats.avvento[button.clicker.user.id] = {
                "1": false,
                "2": false,
                "3": false,
                "4": false,
                "5": false,
                "6": false,
                "7": false,
                "8": false,
                "9": false,
                "10": false,
                "11": false,
                "12": false,
                "13": false,
                "14": false,
                "15": false,
                "16": false,
                "17": false,
                "18": false,
                "19": false,
                "20": false,
                "21": false,
                "22": false,
                "23": false,
                "24": false,
                "25": false,
                "boost2": null,
                "boost3": null,
                "freddura1": null,
                "freddura2": null,
                "regaloFatto": false,
                "ladroFatto": false
            }
        }

        var avvento = serverstats.avvento[button.clicker.user.id]

        //? var day = new Date().getDate()
        //? var month = new Date().getMonth()
        var day = 30
        var month = 11

        if (month == 11 || (month == 0 && day <= 6)) {

        }
        else {
            return
        }

        var daRiscattare = "", numDaRiscattare = 0;

        for (var i = 1; i <= 25; i++) {
            if (month != 11 || i <= day) {
                if (!avvento[i]) {
                    daRiscattare += `- ${i} Dicembre\r`
                    numDaRiscattare++
                }
            }
        }

        if (numDaRiscattare == 0) daRiscattare = "_Non hai nessun premio da riscattare_"

        var embed = new Discord.MessageEmbed()
            .setTitle(":christmas_tree: Avvento della community :christmas_tree:")
            .setColor("#ED1C24")
            .setDescription(`Benvenuto nell'avvento, qua puoi riscattare tutte le ricompense in attesa del **Natale**

Xp, Regali e molto altro, clicca sul menu qua sotto per ottenere tutti i **premi** che ti aspettano con un super regalo per il giorno di Natale`)
            .addField(`${numDaRiscattare != 0 ? "<:closegift:910604692013342720>" : "<:unlockedgift:914089653592809482>"} ${numDaRiscattare != 0 ? numDaRiscattare : ""} ${numDaRiscattare == 1 ? "ricompensa" : numDaRiscattare == 0 ? "Nessuna ricompensa" : "ricompense"} da riscattare`, daRiscattare)
            .setImage(month != 11 || day > 24 ? avventoJSON.banner[25] : avventoJSON.banner[day])
            .setFooter("Ricompense disponibili fino al 06/01")

        let select = new disbut.MessageMenu()
            .setID('riscattaRicompense')
            .setPlaceholder('Riscatta ricompensa')
            .setMaxValues(1)
            .setMinValues(1)

        for (var i = 1; i <= 25; i++) {
            var option = new disbut.MessageMenuOption()
                .setLabel(`${i} Dicembre`)

            if (month != 11 || day >= i) {
                if (!avvento[i]) {
                    option
                        .setEmoji({ id: "910604692013342720", name: "closegift" })
                        .setValue(i)
                        .setDescription("RICOMPENSA DISPONIBILE ")
                }
                else {
                    option
                        .setEmoji({ id: "914090204715966484", name: "opengift" })
                        .setValue("ND" + i)
                        .setDescription("Ricompensa già riscattata")
                }
            }
            else {
                option
                    .setEmoji({ id: "914089653592809482", name: "unlockgift" })
                    .setValue("ND" + i)
                    .setDescription("Ricompensa non ancora disponibile")
            }

            select.addOption(option)
        }

        button.clicker.user.send(embed, select)
            .catch((e) => { console.log(e) })
    },
};