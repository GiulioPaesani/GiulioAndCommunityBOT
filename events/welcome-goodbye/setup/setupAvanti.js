const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("setupAvanti")) return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        switch (interaction.customId.split(",")[1]) {
            case "1": {
                let utente = client.guilds.cache.get(settings.idServer).members.cache.get(interaction.user.id)
                if (!utente) return

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Configura NOTIFICHE`)
                    .setThumbnail(illustrations.notification)
                    .setDescription(`All'interno del server non viene mai utilizzato il tag @everyone, ma semplici ruoli per diversi scopri di notifiche

Seleziona quali **notifiche** ping vuoi ricevere
_Potrai poi modificarle quando vorrai attraverso il comando \`/notifications\`_`)
                    .addFields([
                        {
                            name: `📢 Announcements - ${utente.roles.cache.has(settings.ruoliNotification.announcements) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                            value: "Annunci, notizie e novità nel server, nel canale o molto altro"
                        },
                        {
                            name: `📹 YouTube Video - ${utente.roles.cache.has(settings.ruoliNotification.video) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                            value: "Nuovi video pubblicati sul canale YouTube di GiulioAndCode"
                        },
                        {
                            name: `🟣 Twitch Live - ${utente.roles.cache.has(settings.ruoliNotification.live) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                            value: "Dirette Twitch su gaming, divertimento, programmazione ed eventi"
                        },
                        {
                            name: `🏆 Events - ${utente.roles.cache.has(settings.ruoliNotification.events) ? ":green_circle: ON" : ":red_circle: OFF"}`,
                            value: "Nuovi eventi su sfide di programmazione con la community"
                        }
                    ])
                let button1 = new Discord.MessageButton()
                    .setEmoji("📢")
                    .setCustomId(`notification,${interaction.user.id},1,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

                let button2 = new Discord.MessageButton()
                    .setEmoji("📹")
                    .setCustomId(`notification,${interaction.user.id},2,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.video) ? "SUCCESS" : "DANGER")

                let button3 = new Discord.MessageButton()
                    .setEmoji("🟣")
                    .setCustomId(`notification,${interaction.user.id},3,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.live) ? "SUCCESS" : "DANGER")

                let button4 = new Discord.MessageButton()
                    .setEmoji("🏆")
                    .setCustomId(`notification,${interaction.user.id},4,setup`)
                    .setStyle(utente.roles.cache.has(settings.ruoliNotification.events) ? "SUCCESS" : "DANGER")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)
                    .addComponents(button2)
                    .addComponents(button3)
                    .addComponents(button4)

                let button6 = new Discord.MessageButton()
                    .setLabel("Torna indietro")
                    .setStyle("SECONDARY")
                    .setCustomId("setupIndietro,2")

                let button7 = new Discord.MessageButton()
                    .setLabel("Salta/Prossimo step")
                    .setStyle("PRIMARY")
                    .setCustomId("setupAvanti,2")

                let row2 = new Discord.MessageActionRow()
                    .addComponents(button6)
                    .addComponents(button7)

                interaction.message.edit({ embeds: [embed], components: [row, row2] })
            } break
            case "2": {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Configura COMPLEANNO`)
                    .setColor("#FF1180")
                    .setThumbnail(illustrations.birthdayTodayNotSetted)
                    .setDescription(`Imposta il giorno del tuo **compleanno** in modo da ricevere dal bot e dagli utenti tanti **auguri** e **regali** personalizzati
            
Configura il compleanno con il comando \`/setbirthday [month] [day]\` nel canale <#${settings.idCanaliServer.commands}>
_Una volta settato non potrai più modificarlo_`)
                    .addField(":gift: I regali che riceverai", `
Ogni anno al giorno del tuo compleanno riceverai:
- Punti **esperienza** per salire di livello
- **Coins** da utilizzare nell'economia
- 4 oggetti random dallo **shop** che poi potrai vendere e commerciare
- **Boost x2** livellamento per tutto il giorno`)

                let button1 = new Discord.MessageButton()
                    .setLabel("Torna indietro")
                    .setStyle("SECONDARY")
                    .setCustomId("setupIndietro,3")

                let button2 = new Discord.MessageButton()
                    .setLabel("Configurazione completata")
                    .setStyle("PRIMARY")
                    .setCustomId("setupAvanti,3")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)
                    .addComponents(button2)

                interaction.message.edit({ embeds: [embed], components: [row] })
            } break
            case "3": {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`:white_check_mark: Configurazione terminata`)
                    .setColor(colors.blue)
                    .setDescription(`Hai finito di configurare tutto, ora puoi goderti a pieno l'esperienza all'interno del server, parlare e divertiti con tutti gli utenti
**Buon divertimento!**`)

                let button1 = new Discord.MessageButton()
                    .setLabel("Torna indietro")
                    .setStyle("SECONDARY")
                    .setCustomId("setupIndietro,4")

                let row = new Discord.MessageActionRow()
                    .addComponents(button1)

                interaction.message.edit({ embeds: [embed], components: [row] })
            } break
        }
    },
};
