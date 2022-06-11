const Discord = require('discord.js');
const log = require("../../../config/general/log.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");

module.exports = {
    name: "messageCreate",
    client: "general",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return
        if (message.guild?.id != log.idServer) return

        if (message.channel.id != log.general.thingsToDo) return

        message.delete()

        if (getUserPermissionLevel(client, message.author.id) <= 2) return

        if (!message.content) return

        client.channels.cache.get(log.general.thingsToDo).messages.fetch(message.reference.messageId)
            .then(msg => {
                if (!msg.embeds[0]) return

                const args = message.content.split(/ +/);
                let ttd = args.join(" ");
                if (!ttd) return

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

                msg.embeds[0].fields[0].value = ttd
                msg.edit({ embeds: [msg.embeds[0]], components: [row] })
            })
    },
};
