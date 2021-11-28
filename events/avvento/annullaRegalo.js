module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (settings.inMaintenanceMode)
            if (button.clicker.user.id != settings.idGiulio) return

        if (!button.id.startsWith("annullaRegalo")) return

        if (button.clicker.user.id != button.id.split(",")[1]) return

        var avvento = serverstats.avvento[button.clicker.user.id]
        if (!avvento) return

        button.message.delete()
    },
};