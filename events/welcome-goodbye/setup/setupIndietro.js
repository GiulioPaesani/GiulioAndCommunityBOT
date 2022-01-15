module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("setupIndietro")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        switch (button.id.split(",")[1]) {
            case "2": {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`Benvenuto ${button.clicker.user.username}`)
                    .setColor("#42A9F6")
                    .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                    .setDescription(`Ciao, benvenuto all'interno del server **GiulioAndCommunity**. In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
Prima di partecipare al server leggi tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server

:bust_in_silhouette: Prosegui per **configurare** il tuo profilo nel server con il bottone **"Configura profilo"** e impostare cose molto interessanti...
`)

                var button1 = new disbut.MessageButton()
                    .setLabel("Configura profilo")
                    .setStyle("blurple")
                    .setID("setupAvanti,1")

                button.message.edit(embed, button1)
            } break
            case "3": {
                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == button.clicker.user.id)

                var embed = new Discord.MessageEmbed()
                    .setTitle(`Configura NOTIFICHE`)
                    .setThumbnail("https://i.postimg.cc/3wKvXm4M/Notifications.png")
                    .setDescription(`All'interno del server non viene mai utilizzato il tag @everyone, ma semplici ruoli per diversi scopri di notifiche

Seleziona quali **notifiche** vuoi ricevere
_Potrai poi modificarle con il comando \`!config\`_`)
                    .addField(`📋 Announcements - ${utente.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Annunci grossi e importanti relativi al canale e al server")
                    .addField(`📰 News - ${utente.roles.cache.has(settings.ruoliNotification.news) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Notizie piccole e leggere sul canale e sul server")
                    .addField(`📝 Changelog - ${utente.roles.cache.has(settings.ruoliNotification.changelog) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Tutte le novità, funzioni, comandi che vengono aggiunte al bot del server")
                    .addField(`📱 YouTube GiulioAndCode - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale GiulioAndCode")
                    .addField(`✌ YouTube Giulio - ${utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? ":green_circle: ON" : ":red_circle: OFF"}`, "Nuovi video pubblicati sul canale Giulio")

                var button1 = new disbut.MessageButton()
                    .setEmoji("📋")
                    .setID(`notification,${button.clicker.user.id},1,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "green" : "red")

                var button2 = new disbut.MessageButton()
                    .setEmoji("📰")
                    .setID(`notification,${button.clicker.user.id},2,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.news) ? "green" : "red")

                var button3 = new disbut.MessageButton()
                    .setEmoji("📝")
                    .setID(`notification,${button.clicker.user.id},3,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.changelog) ? "green" : "red")

                var button4 = new disbut.MessageButton()
                    .setEmoji("📱")
                    .setID(`notification,${button.clicker.user.id},4,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosCode) ? "green" : "red")

                var button5 = new disbut.MessageButton()
                    .setEmoji("✌")
                    .setID(`notification,${button.clicker.user.id},5,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.youtubeVideosGiulio) ? "green" : "red")

                var row = new disbut.MessageActionRow()
                    .addComponent(button1)
                    .addComponent(button2)
                    .addComponent(button3)
                    .addComponent(button4)
                    .addComponent(button5)

                var button6 = new disbut.MessageButton()
                    .setLabel("Torna indietro")
                    .setStyle("gray")
                    .setID("setupIndietro,2")

                var button7 = new disbut.MessageButton()
                    .setLabel("Salta/Prossimo step")
                    .setStyle("blurple")
                    .setID("setupAvanti,2")

                var row2 = new disbut.MessageActionRow()
                    .addComponent(button6)
                    .addComponent(button7)

                button.message.edit({ embed: embed, components: [row, row2] })
            } break
            case "4": {
                var embed = new Discord.MessageEmbed()
                    .setTitle(`Configura COMPLEANNO`)
                    .setColor("#FF1180")
                    .setThumbnail("https://i.postimg.cc/g2cpJ0Jb/birthday-Today.png")
                    .setDescription(`Imposta il giorno del tuo **compleanno** in modo da ricevere dal bot e dagli utenti tanti **auguri** e **regali** personallizati
            
Configura il compleanno con il comando \`!setbirthday [month] [day]\` nel canale <#${settings.idCanaliServer.commands}>
_Una volta settato non potrai più modificarlo_`)
                    .addField(":gift: I regali che riceverai", `
Ogni anno al giorno del tuo compleanno riceverai:
- Punti **esperienza** per salire di livello
- **Coins** da utilizzare nell'economia
- 4 oggetti random dallo **shop** che poi potrai vendere e commerciare
- **Boost x2** livellamento per tutto il giorno`)

                var button1 = new disbut.MessageButton()
                    .setLabel("Torna indietro")
                    .setStyle("gray")
                    .setID("setupIndietro,3")

                var button2 = new disbut.MessageButton()
                    .setLabel("Configurazione completata")
                    .setStyle("blurple")
                    .setID("setupAvanti,3")

                var row = new disbut.MessageActionRow()
                    .addComponent(button1)
                    .addComponent(button2)

                button.message.edit(embed, row)
            } break
        }
    },
};
