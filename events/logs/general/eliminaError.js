module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "eliminaError") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        button.message.delete()
            .catch(() => { })
    },
};