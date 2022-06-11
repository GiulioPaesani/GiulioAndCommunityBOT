const colors = require("../../../config/general/colors.json");
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isSelectMenu()) return
        if (!interaction.customId.startsWith("ttdMenu")) return

        if (isMaintenance(interaction.user.id)) return

        if (getUserPermissionLevel(client, interaction.user.id) <= 2) return

        interaction.deferUpdate()

        switch (interaction.values[0]) {
            case "ttdIdea": {
                interaction.message.embeds[0].fields[0].name = "💡 Idea";
                interaction.message.embeds[0].color = colors.yellow
            } break
            case "ttdWhite": {
                interaction.message.embeds[0].fields[0].name = "⚪ Uncompleted";
                interaction.message.embeds[0].color = colors.white
            } break
            case "ttdRed": {
                interaction.message.embeds[0].fields[0].name = "🔴 Urgent";
                interaction.message.embeds[0].color = colors.red
            } break
            case "ttdGreen": {
                interaction.message.embeds[0].fields[0].name = "🟢 Completed";
                interaction.message.embeds[0].color = colors.green
            } break
            case "ttdBlue": {
                interaction.message.embeds[0].fields[0].name = "🔵 Tested";
                interaction.message.embeds[0].color = colors.blue
            } break
            case "ttdBlack": {
                interaction.message.embeds[0].fields[0].name = "⚫ Finished";
                interaction.message.embeds[0].color = colors.black
            } break
            case "ttdDelete": {
                interaction.message.delete()
                    .catch(() => { })
            } break
        }

        interaction.message.edit({ embeds: [interaction.message.embeds[0]] })
            .catch(() => { })
    },
};