const fs = require("fs")

const getUser = async (userId) => {
    try {
        let data = JSON.parse(fs.readFileSync(`./database/users/${userId}.json`, 'utf8'))

        if (JSON.stringify(data).includes("$numberLong")) {
            if (data.joinedAt?.$numberLong) data.joinedAt = parseInt(data.joinedAt.$numberLong)
            if (data.leavedAt?.$numberLong) data.leavedAt = parseInt(data.leavedAt.$numberLong)
            if (data.counting.timeLastScore?.$numberLong) data.counting.timeLastScore = parseInt(data.counting.timeLastScore.$numberLong)
            if (data.countingplus.timeLastScore?.$numberLong) data.countingplus.timeLastScore = parseInt(data.countingplus.timeLastScore.$numberLong)
            if (data.counting.timeBestScore?.$numberLong) data.counting.timeBestScore = parseInt(data.counting.timeBestScore.$numberLong)
            if (data.moderation.since?.$numberLong) data.moderation.since = parseInt(data.moderation.since.$numberLong)
            if (data.moderation.until?.$numberLong) data.moderation.until = parseInt(data.moderation.until.$numberLong)
            if (data.warns.find(x => x.time?.$numberLong)) {
                for (let x = 0; x < data.warns.length; x++) {
                    data.warns[x].time = parseInt(data.warns[x].time.$numberLong)
                }
            }
            if (data.warns.find(x => x.unTime?.$numberLong)) {
                for (let x = 0; x < data.warns.length; x++) {
                    if (data.warns[x].unTime)
                        data.warns[x].unTime = parseInt(data.warns[x].unTime.$numberLong)
                }
            }
        }

        if (!data.invites) data.invites = {}

        return data
    }
    catch { }
}

module.exports = { getUser }