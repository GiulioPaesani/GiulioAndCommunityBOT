const Discord = require("discord.js")
const colors = require("../../../config/general/colors.json")
const log = require("../../../config/general/log.json")

module.exports = {
    name: "ttd",
    description: "Creare una Thing to Do",
    permissionLevel: 3,
    requiredLevel: 0,
    syntax: "/ttd [text]",
    category: "general",
    client: "general",
    data: {
        options: [
            {
                name: "text",
                description: "Testo della Thing to Do",
                type: "STRING",
                required: true,
            },
            {
                name: "status",
                description: "Testo della Thing to Do",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "💡 Idea",
                        value: "ttdIdea",
                    },
                    {
                        name: "[Default] ⚪ Uncompleted",
                        value: "ttdWhite",

                    },
                    {
                        name: "🔴 Urgent",
                        value: "ttdRed",

                    },
                    {
                        name: "🟢 Completed",
                        value: "ttdGreen",
                    },
                    {
                        name: "🔵 Tested",
                        value: "ttdBlue",

                    },
                    {
                        name: "⚫ Finished",
                        value: "ttdBlack",
                    }
                ]
            }
        ]
    },
    otherGuild: true,
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let text = interaction.options.getString("text")
        let category = interaction.options.getString("category") || "ttdWhite"

        if (text.length > 1024) {
            return replyMessage(client, interaction, "Warning", "Testo troppo lungo", "Puoi scrivere una Thing to Do solo fino a 1024 caratteri", comando)
        }

        embed = new Discord.MessageEmbed()
            .setTitle("📋 Thing to do creata 📋")
            .setDescription("La Thing to Do è stata creata ed iniviata nel canale corrispondente per essere completata")

        let embed2 = new Discord.MessageEmbed()

        switch (category) {
            case "ttdIdea": {
                embed.addField("💡 Idea", text)
                embed2.addField("💡 Idea", text)
                embed.setColor(colors.yellow)
                embed2.setColor(colors.yellow)
            } break
            case "ttdWhite": {
                embed.addField("⚪ Uncompleted", text)
                embed2.addField("⚪ Uncompleted", text)
                embed.setColor(colors.white)
                embed2.setColor(colors.white)
            } break
            case "ttdRed": {
                embed.addField("🔴 Urgent", text)
                embed2.addField("🔴 Urgent", text)
                embed.setColor(colors.red)
                embed2.setColor(colors.red)
            } break
            case "ttdGreen": {
                embed.addField("🟢 Completed", text)
                embed2.addField("🟢 Completed", text)
                embed.setColor(colors.green)
                embed2.setColor(colors.green)
            } break
            case "ttdBlue": {
                embed.addField("🔵 Tested", text)
                embed2.addField("🔵 Tested", text)
                embed.setColor(colors.blue)
                embed2.setColor(colors.blue)
            } break
            case "ttdBlack": {
                embed.addField("⚫ Finished", text)
                embed2.addField("⚫ Finished", text)
                embed.setColor(colors.black)
                embed2.setColor(colors.black)
            } break
        }

        interaction.reply({ embeds: [embed] })

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

        // client.channels.cache.get(log.general.thingsToDo).send({ embeds: [embed2], components: [row] })
    },
};