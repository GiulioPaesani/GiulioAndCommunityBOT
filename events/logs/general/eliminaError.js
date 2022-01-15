module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "eliminaError") return

        if (isMaintenance(button.clicker.user.id)) return

        button.reply.defer()

        button.message.delete()
    },
};