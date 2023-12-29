const settings = require("../../config/general/settings.json")
const blockedChannels = [
    settings.idCanaliServer.rules,
    settings.idCanaliServer.info,
    settings.idCanaliServer.announcements,
    settings.idCanaliServer.suggestions,
    settings.idCanaliServer.polls,
    settings.idCanaliServer.staffPolls,
    settings.idCanaliServer.qna,
    settings.idCanaliServer.ourProjects,
    settings.idCanaliServer.help,
    settings.idCanaliServer.support,
    settings.idCanaliServer.privateRooms,
    settings.idCanaliServer.memberCounter,
]

module.exports = { blockedChannels }