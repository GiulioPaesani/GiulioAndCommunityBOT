module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.id != log.thingsToDo) return

        if (!message.reference) return

        message.delete()
            .catch(() => { })

        client.channels.cache.get(log.thingsToDo).messages.fetch(message.reference.messageID)
            .then(msg => {
                if (!msg.embeds[0]) return

                const args = message.content.split(/ +/);
                var ttd = args.join(" ");
                if (!ttd) return

                let option1 = new disbut.MessageMenuOption()
                    .setLabel('Uncompleted')
                    .setEmoji('⚪')
                    .setValue('ttdWhite')
                    .setDescription('Thing to do non ancora completata')
                let option2 = new disbut.MessageMenuOption()
                    .setLabel('Urgent')
                    .setEmoji('🔴')
                    .setValue('ttdRed')
                    .setDescription('Thing to do urgente da realizzare')
                let option3 = new disbut.MessageMenuOption()
                    .setLabel('Completed')
                    .setEmoji('🟢')
                    .setValue('ttdGreen')
                    .setDescription('Thing to do completata')
                let option4 = new disbut.MessageMenuOption()
                    .setLabel('Tested')
                    .setEmoji('🔵')
                    .setValue('ttdBlue')
                    .setDescription('Thing to do testata e funzionante')
                let option5 = new disbut.MessageMenuOption()
                    .setLabel('Finished')
                    .setEmoji('⚫')
                    .setValue('ttdBlack')
                    .setDescription('Thing to do terminata')
                let option6 = new disbut.MessageMenuOption()
                    .setLabel('Delete')
                    .setEmoji('❌')
                    .setValue('ttdDelete')
                    .setDescription('Elimina Thing to do')

                let select = new disbut.MessageMenu()
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

                msg.embeds[0].fields[1].value = "```" + ttd + "```"
                msg.edit(msg.embeds[0], select)
            })
    },
};