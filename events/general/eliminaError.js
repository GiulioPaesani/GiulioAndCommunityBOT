const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../functions/general/isMaintenance");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (interaction.customId != "eliminaError") return

        if (getUserPermissionLevel(client, interaction.user.id) <= 2) return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        interaction.message.delete()
            .catch(() => { })
    },
};