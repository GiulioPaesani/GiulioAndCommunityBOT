const settings = require("../../config/general/settings.json")
const blockedChannels = [
    settings.idCanaliServer.rules,
    settings.idCanaliServer.info,
    settings.idCanaliServer.announcements,
    settings.idCanaliServer.suggestions,
    settings.idCanaliServer.judgeMyServer,
    settings.idCanaliServer.polls,
    settings.idCanaliServer.staffPolls,
    settings.idCanaliServer.qna,
    settings.idCanaliServer.ourProjects,
    settings.idCanaliServer.faq,
    settings.idCanaliServer.help,
    settings.idCanaliServer.support,
    settings.idCanaliServer.privateRooms,
    settings.idCanaliServer.joinTheServer,
    settings.idCanaliServer.lockdown,
    settings.idCanaliServer.mutedTicket,
    settings.idCanaliServer.tempmutedTicket,
    settings.idCanaliServer.bannedTicket,
    settings.idCanaliServer.tempbannedTicket,
    settings.idCanaliServer.memberCounter,
]

module.exports = { blockedChannels }