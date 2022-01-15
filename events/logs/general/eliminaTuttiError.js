module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "eliminaTuttiError") return

        if (isMaintenance(button.clicker.user.id)) return

        button.reply.defer()
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