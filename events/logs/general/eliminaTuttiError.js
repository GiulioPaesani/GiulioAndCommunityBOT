module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "eliminaTuttiError") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        button.message.channel.messages.fetch()
            .then(messages => {
                messages.forEach(msg => {
                    if (msg.embeds[0]?.fields[1]?.value == button.message.embeds[0]?.fields[1]?.value) {
                        msg.delete()
                            .catch(() => { })
                    }
                });
            })
    },
};