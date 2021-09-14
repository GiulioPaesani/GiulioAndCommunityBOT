const Discord = require("discord.js");

const { MessageMenuOption } = require('discord-buttons');
const { MessageMenu } = require('discord-buttons')

module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (menu.id != "ttdMenu") return
        menu.reply.defer()

        var embed = menu.message.embeds[0]

        let option1 = new MessageMenuOption()
            .setLabel('Uncompleted')
            .setEmoji('⚪')
            .setValue('ttdWhite')
            .setDescription('Thing to do non ancora completata')
        let option2 = new MessageMenuOption()
            .setLabel('Urgent')
            .setEmoji('🔴')
            .setValue('ttdRed')
            .setDescription('Thing to do urgente da realizzare')
        let option3 = new MessageMenuOption()
            .setLabel('Completed')
            .setEmoji('🟢')
            .setValue('ttdGreen')
            .setDescription('Thing to do completata')
        let option4 = new MessageMenuOption()
            .setLabel('Tested')
            .setEmoji('🔵')
            .setValue('ttdBlue')
            .setDescription('Thing to do testata e funzionante')
        let option5 = new MessageMenuOption()
            .setLabel('Finished')
            .setEmoji('⚫')
            .setValue('ttdBlack')
            .setDescription('Thing to do terminata')
        let option6 = new MessageMenuOption()
            .setLabel('Delete')
            .setEmoji('❌')
            .setValue('ttdDelete')
            .setDescription('Elimina Thing to do')

        let select = new MessageMenu()
            .setID('ttdMenu')
            .setPlaceholder('Select status...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option1)
            .addOption(option2)
            .addOption(option3)
            .addOption(option4)
            .addOption(option5)
            .addOption(option6)

        switch (menu.values[0]) {
            case "ttdWhite": {
                embed.fields[0].value = "```⚪Uncompleted```";
                embed.color = "15132648"
            } break
            case "ttdRed": {
                embed.fields[0].value = "```🔴Urgent```";
                embed.color = "14495300"
            } break
            case "ttdGreen": {
                embed.fields[0].value = "```🟢Completed```";
                embed.color = "7909721"
            } break
            case "ttdBlue": {
                embed.fields[0].value = "```🔵Tested```";
                embed.color = "5614830"
            } break
            case "ttdBlack": {
                embed.fields[0].value = "```⚫Finished```";
                embed.color = "3225405"
            } break
            case "ttdDelete": {
                menu.message.delete()
                return
            } break

        }
        menu.message.edit(embed, select)
    },
};