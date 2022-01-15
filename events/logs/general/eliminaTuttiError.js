module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "eliminaTuttiError") return

        button.reply.defer()

        if (isMaintenance(button.clicker.user.id)) return

        button.message.channel.messages.fetch()
            .then(messages => {
                messages.forEach(msg => {
                    if (msg.embeds[0]?.fields[1]?.value == button.message.embeds[0]?.fields[1]?.value) {
                        msg.delete()
                    }
                });
            })
    },
};