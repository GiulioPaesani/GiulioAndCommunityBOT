const fs = require("fs")

const getUser = async (userId) => {
    try {
        let data = JSON.parse(fs.readFileSync(`./database/users/${userId}.json`, 'utf8'))

        if (data.joinedAt?.$numberLong) data.joinedAt = parseInt(data.joinedAt.$numberLong)
        if (data.timeLastScore?.$numberLong) data.timeLastScore = parseInt(data.timeLastScore.$numberLong)
        if (data.timeBestScore?.$numberLong) data.timeBestScore = parseInt(data.timeBestScore.$numberLong)

        return data
    }
    catch { }
}

module.exports = { getUser }