module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "eliminaError") return

        button.reply.defer()

        if (isMaintenance(button.clicker.user.id)) return

        button.message.delete()
    },
};