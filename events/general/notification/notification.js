const Discord = require("discord.js")
const settings = require("../../../config/general/settings.json")
const illustrations = require("../../../config/general/illustrations.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { replyMessage } = require("../../../functions/general/replyMessage")

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (!interaction.customId.startsWith("notification")) return

        await interaction.deferUpdate().catch(() => { })

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let utente = interaction.member || client.guilds.cache.get(settings.idServer).members.cache.get(interaction.user.id)
        if (!utente) {
            return replyMessage(client, interaction, "Error", "Non sei nel server", "Non sei più nel server, non puoi configurare i ruoli di notifica")
        }

        switch (interaction.customId.split(",")[2]) {
            case "1": {
                utente.roles.cache.has(settings.ruoliNotification.announcements) ? await utente.roles.remove(settings.ruoliNotification.announcements) : await utente.roles.add(settings.ruoliNotification.announcements)
            } break;
            case "2": {
                utente.roles.cache.has(settings.ruoliNotification.video) ? await utente.roles.remove(settings.ruoliNotification.video) : await utente.roles.add(settings.ruoliNotification.video)
            } break;
            case "3": {
                utente.roles.cache.has(settings.ruoliNotification.live) ? await utente.roles.remove(settings.ruoliNotification.live) : await utente.roles.add(settings.ruoliNotification.live)
            } break;
            case "4": {
                utente.roles.cache.has(settings.ruoliNotification.events) ? await utente.roles.remove(settings.ruoliNotification.events) : await utente.roles.add(settings.ruoliNotification.events)
            } break;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(interaction.message.embeds[0].title)
            .setDescription(interaction.message.embeds[0].description)
            .setThumbnail(illustrations.notification)
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
            .setCustomId(`notification,${interaction.user.id},1${interaction.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.announcements) ? "SUCCESS" : "DANGER")

        let button2 = new Discord.MessageButton()
            .setEmoji("📹")
            .setCustomId(`notification,${interaction.user.id},2${interaction.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.video) ? "SUCCESS" : "DANGER")

        let button3 = new Discord.MessageButton()
            .setEmoji("🟣")
            .setCustomId(`notification,${interaction.user.id},3${interaction.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.live) ? "SUCCESS" : "DANGER")

        let button4 = new Discord.MessageButton()
            .setEmoji("🏆")
            .setCustomId(`notification,${interaction.user.id},4${interaction.customId.split(",")[3] ? ",setup" : ""}`)
            .setStyle(utente.roles.cache.has(settings.ruoliNotification.events) ? "SUCCESS" : "DANGER")

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)

        if (interaction.customId.split(",")[3]) {
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
        }
        else {
            interaction.message.edit({ embeds: [embed], components: [row] })
        }
    },
};
