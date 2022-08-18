const fs = require("fs")

const getUser = async (userId) => {
    try {
        if (!fs.existsSync(`./database/users/${userId}.json`)) return

        let data = JSON.parse(fs.readFileSync(`./database/users/${userId}.json`, 'utf8'))

        if (data.joinedAt && data.joinedAt["$numberLong"]) data.joinedAt = data.joinedAt["$numberLong"]
        if (data.leavedAt && data.leavedAt["$numberLong"]) data.leavedAt = data.leavedAt["$numberLong"]


        if (data.counting.timeLastScore && data.counting.timeLastScore["$numberLong"]) data.counting.timeLastScore = data.counting.timeLastScore["$numberLong"]
        if (data.counting.timeBestScore && data.counting.timeBestScore["$numberLong"]) data.counting.timeBestScore = data.counting.timeBestScore["$numberLong"]

        if (data.countingplus.timeLastScore && data.countingplus.timeLastScore["$numberLong"]) data.countingplus.timeLastScore = data.countingplus.timeLastScore["$numberLong"]

        if (data.countingplus.timeLastScore && data.countingplus.timeLastScore["$numberLong"]) data.countingplus.timeLastScore = data.countingplus.timeLastScore["$numberLong"]

        if (data.moderation.since && data.moderation.since["$numberLong"]) data.moderation.since = data.moderation.since["$numberLong"]
        if (data.moderation.until && data.moderation.until["$numberLong"]) data.moderation.until = data.moderation.until["$numberLong"]

        if (data.warns.some(x => x.time["$numberLong"])) {
            for (let index in data.warns) {
                if (data.warns[index].time && data.warns[index].time["$numberLong"]) data.warns[index].time = data.warns[index].time["$numberLong"]
            }
        }

        return data
    }
    catch (e) { console.log(e) }
}

module.exports = { getUser }