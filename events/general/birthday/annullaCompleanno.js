module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("annullaCompleanno")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        button.message.delete()
            .catch(() => { })
    },
};
