const settings = require("../../config/general/settings.json")
const fs = require("fs")

const getAllUsers = async (client, onlyInGuild = true) => {
    let guildUsers = client.guilds.cache.get(settings.idServer).members.cache.map(x => x)

    let data = []

    const folder = fs.readdirSync("./database/users/");
    for (const user of folder) {
        if (onlyInGuild) {
            if (guildUsers.find(x => x.id == user.split(".")[0])) {
                let userstats = fs.readFileSync(`./database/users/${user}`, 'utf8')

                if (JSON.stringify(userstats).includes("$numberLong")) {
                    if (userstats.joinedAt?.$numberLong) userstats.joinedAt = parseInt(userstats.joinedAt.$numberLong)
                    if (userstats.leavedAt?.$numberLong) userstats.leavedAt = parseInt(userstats.leavedAt.$numberLong)
                    if (userstats.counting.timeLastScore?.$numberLong) userstats.counting.timeLastScore = parseInt(userstats.counting.timeLastScore.$numberLong)
                    if (userstats.countingplus.timeLastScore?.$numberLong) userstats.countingplus.timeLastScore = parseInt(userstats.countingplus.timeLastScore.$numberLong)
                    if (userstats.counting.timeBestScore?.$numberLong) userstats.counting.timeBestScore = parseInt(userstats.counting.timeBestScore.$numberLong)
                    if (userstats.moderation.since?.$numberLong) userstats.moderation.since = parseInt(userstats.moderation.since.$numberLong)
                    if (userstats.moderation.until?.$numberLong) userstats.moderation.until = parseInt(userstats.moderation.until.$numberLong)
                    if (userstats.warns.find(x => x.time?.$numberLong)) {
                        for (let x = 0; x < userstats.warns.length; x++) {
                            userstats.warns[x].time = parseInt(userstats.warns[x].time.$numberLong)
                        }
                    }
                    if (userstats.warns.find(x => x.unTime?.$numberLong)) {
                        for (let x = 0; x < userstats.warns.length; x++) {
                            if (userstats.warns[x].unTime)
                                userstats.warns[x].unTime = parseInt(userstats.warns[x].unTime.$numberLong)
                        }
                    }
                }

                if (!userstats.invites) userstats.invites = {}

                data.push(JSON.parse(userstats))
            }
        }
        else {
            let userstats = fs.readFileSync(`./database/users/${user}`, 'utf8')

            if (JSON.stringify(userstats).includes("$numberLong")) {
                if (userstats.joinedAt?.$numberLong) userstats.joinedAt = parseInt(userstats.joinedAt.$numberLong)
                if (userstats.leavedAt?.$numberLong) userstats.leavedAt = parseInt(userstats.leavedAt.$numberLong)
                if (userstats.counting.timeLastScore?.$numberLong) userstats.counting.timeLastScore = parseInt(userstats.counting.timeLastScore.$numberLong)
                if (userstats.countingplus.timeLastScore?.$numberLong) userstats.countingplus.timeLastScore = parseInt(userstats.countingplus.timeLastScore.$numberLong)
                if (userstats.counting.timeBestScore?.$numberLong) userstats.counting.timeBestScore = parseInt(userstats.counting.timeBestScore.$numberLong)
                if (userstats.moderation.since?.$numberLong) userstats.moderation.since = parseInt(userstats.moderation.since.$numberLong)
                if (userstats.moderation.until?.$numberLong) userstats.moderation.until = parseInt(userstats.moderation.until.$numberLong)
                if (userstats.warns.find(x => x.time?.$numberLong)) {
                    for (let x = 0; x < userstats.warns.length; x++) {
                        userstats.warns[x].time = parseInt(userstats.warns[x].time.$numberLong)
                    }
                }
                if (userstats.warns.find(x => x.unTime?.$numberLong)) {
                    for (let x = 0; x < userstats.warns.length; x++) {
                        if (userstats.warns[x].unTime)
                            userstats.warns[x].unTime = parseInt(userstats.warns[x].unTime.$numberLong)
                    }
                }
            }

            if (!userstats.invites) userstats.invites = {}

            data.push(JSON.parse(userstats))
        }
    }
    return data
}

module.exports = { getAllUsers }