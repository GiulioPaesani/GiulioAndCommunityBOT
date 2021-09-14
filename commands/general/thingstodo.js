const Discord = require("discord.js");
const moment = require("moment")

const { MessageMenuOption } = require('discord-buttons');
const { MessageMenu } = require('discord-buttons')

module.exports = {
    name: "thingstodo",
    aliases: ["ttd"],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        if (message.guild.id != log.server) return

        var ttd = args.join(" ");
        if (!ttd) {
            error(message, "Inserire una cosa da fare", "`!ttd [text]`")
            return
        }

        var embed = new Discord.MessageEmbed()
            .addField("Status", "```⚪Uncompleted```")
            .addField("Thing to do...", "```" + ttd + "```", true)
            .setColor("#E6E7E8")

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
            .setLabel('Finisched')
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

        message.channel.send(embed, select)
    },
};
