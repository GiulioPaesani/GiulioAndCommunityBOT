const { getUser } = require("../database/getUser")
const fs = require("fs")

const addUser = async (member) => {
    if (!member) return
    if (member.bot) return

    let userstats = await getUser(member.id)

    if (!userstats) {
        userstats = {
            id: member.id || null,
            username: member.user?.tag || member.tag || "",
            roles: [],
            joinedAt: member.joinedAt?.getTime() ? member.joinedAt.getTime() : null,
            leavedAt: null,
            birthday: [],
            counting: {
                lastScore: 0,
                bestScore: 0,
                timeLastScore: null,
                timeBestScore: null,
                correct: 0,
                incorrect: 0,
                streak: 0,
                updated: 0,
                deleted: 0
            },
            countingplus: {
                lastScore: 0,
                timeLastScore: null,
                correct: 0,
                incorrect: 0,
                streak: 0,
                updated: 0,
                deleted: 0
            },
            onewordstory: {
                totWords: 0,
                totWordsToday: 0,
                totStories: 0
            },
            leveling: {
                level: 0,
                xp: 0,
                livelliSuperati: {},
            },
            economy: {
                money: 0,
                inventory: {},
            },
            moderation: {
                type: "",
                since: "",
                until: "",
                reason: "",
                moderator: "",
                ticketOpened: false
            },
            warns: []
        }

        await fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userstats))
    }

    return userstats
}

module.exports = { addUser }