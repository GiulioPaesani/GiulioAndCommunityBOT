module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "eliminaError") return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        button.message.delete()
    },
};