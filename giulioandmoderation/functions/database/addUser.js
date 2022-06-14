const fs = require("fs")
const { getUser } = require("../database/getUser")
const { getUserStats } = require("./getUserStats")

const addUser = (member) => {
    try {
        if (!member) return
        if (member.bot) return

        if (!getUser(member.id) && !getUserStats(member.id)) fs.mkdirSync(`../database/users/${member.id}`)

        if (!getUser(member.id)) {
            const data = {
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
                    since: null,
                    until: null,
                    reason: null,
                    moderator: null,
                    ticketOpened: false
                },
                warns: [],
                invites: {}
            }


            fs.writeFileSync(`../database/users/${member.id}/${member.id}.json`, JSON.stringify(data))
        }

        if (!getUserStats(member.id)) {
            const dataStats = {

            }

            fs.writeFileSync(`../database/users/${member.id}/${member.id}Stats.json`, JSON.stringify(dataStats))
        }

        return [getUser(member.id), getUserStats(member.id)]
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { addUser }