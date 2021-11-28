module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (config.inMaintenanceMode)
            if (button.clicker.user.id != config.idGiulio) return

        if (!button.id.startsWith("annullaRegalo")) return

        if (button.clicker.user.id != button.id.split(",")[1]) return

        var avvento = serverstats.avvento[button.clicker.user.id]
        if (!avvento) return

        button.message.delete()
    },
};