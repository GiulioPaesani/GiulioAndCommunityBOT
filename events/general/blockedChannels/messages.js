const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { blockedChannels } = require("../../../functions/general/blockedChannels");
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return
        if (isMaintenance(message.author.id)) return
        if (getUserPermissionLevel(client, message.author.id) == 3) return

        if (blockedChannels.includes(message.channel.id)) message.delete()
    },
};
