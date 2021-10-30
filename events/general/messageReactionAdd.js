module.exports = {
    name: `messageReactionAdd`,
    async execute(messageReaction, user) {
        if (user.bot) return

        if (messageReaction.message.partial) await messageReaction.message.fetch();

        if ([config.idCanaliServer.welcome, config.idCanaliServer.announcements, config.idCanaliServer.rules, config.idCanaliServer.info, config.idCanaliServer.youtubeNotification, config.idCanaliServer.becomeHelper, config.idCanaliServer.staffHelp, config.idCanaliServer.levelUp, config.idCanaliServer.log, config.idCanaliServer.privateRooms, config.idCanaliServer.mutedTicket, config.idCanaliServer.tempmutedTicket, config.idCanaliServer.bannedTicket, config.idCanaliServer.tempbannedTicket, config.idCanaliServer.lockdown].includes(messageReaction.message.channel.id)) {
            if (user.id != config.idGiulio)
                messageReaction.users.remove(user);
        }
    },
};