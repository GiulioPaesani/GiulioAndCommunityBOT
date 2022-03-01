module.exports = {
    name: `messageReactionAdd`,
    async execute(messageReaction, user) {
        if (isMaintenance(user.id)) return

        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if ([settings.idCanaliServer.rules, settings.idCanaliServer.info, settings.idCanaliServer.youtubeNotification, settings.idCanaliServer.becomeHelper, settings.idCanaliServer.staffHelp, settings.idCanaliServer.privateRooms, settings.idCanaliServer.mutedTicket, settings.idCanaliServer.tempmutedTicket, settings.idCanaliServer.bannedTicket, settings.idCanaliServer.tempbannedTicket, settings.idCanaliServer.lockdown].includes(messageReaction.message.channel.id)) {
            if (user.id != settings.idGiulio)
                messageReaction.users.remove(user);
        }
    },
};