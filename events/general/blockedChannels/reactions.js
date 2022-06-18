const settings = require("../../../config/general/settings.json")
const { getUserPermissionLevel } = require("../../../functions/general/getUserPermissionLevel");
const { blockedChannels } = require("../../../functions/general/blockedChannels");
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: "messageReactionAdd",
    async execute(client, messageReaction, user) {
        if (user.bot) return
        if (isMaintenance(user.id)) return
        if (getUserPermissionLevel(client, user.id) == 3) return

        if (messageReaction.message.channel.id == settings.idCanaliServer.polls) return
        if (messageReaction.message.channel.id == settings.idCanaliServer.staffPolls) return
        if (messageReaction.message.channel.id == settings.idCanaliServer.suggestions) return

        if (blockedChannels.includes(messageReaction.message.channel.id)) messageReaction.users.remove(user)
    },
};
