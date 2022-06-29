const Discord = require('discord.js');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return
        if (message.guild?.id != log.idServer) return

        if (message.channel.id != log.general.thingsToDo) return

        if (message.author.bot) return

        message.delete()

        if (message.reference) return

        if (getUserPermissionLevel(client, message.author.id) <= 2) return

        if (!message.content) return

        if (message.content > 1024) return

        let embed = new Discord.MessageEmbed()
            .setColor(colors.white)
            .addField("⚪ Uncompleted", message.content)

        let select = new Discord.MessageSelectMenu()
            .setCustomId('ttdMenu')
            .setPlaceholder('Select status...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Idea",
                emoji: "💡",
                value: "ttdIdea",
                description: "Thing to do da definire"
            })
            .addOptions({
                label: "Uncompleted",
                emoji: "⚪",
                value: "ttdWhite",
                description: "Thing to do non ancora completata"
            })
            .addOptions({
                label: "Urgent",
                emoji: "🔴",
                value: "ttdRed",
                description: "Thing to do urgente da realizzare"
            })
            .addOptions({
                label: "Completed",
                emoji: "🟢",
                value: "ttdGreen",
                description: "Thing to do completata"
            })
            .addOptions({
                label: "Tested",
                emoji: "🔵",
                value: "ttdBlue",
                description: "Thing to do testata e funzionante"
            })
            .addOptions({
                label: "Finished",
                emoji: "⚫",
                value: "ttdBlack",
                description: "Thing to do terminata"
            })
            .addOptions({
                label: "Delete",
                emoji: "❌",
                value: "ttdDelete",
                description: "Elimina Thing to do"
            })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] })
    },
};
