const fs = require("fs")

const getServer = async () => {
    let data = JSON.parse(fs.readFileSync('./database/server/server.json', 'utf8'))

    if (JSON.stringify(data).includes("$numberLong")) {
        if (data.joinedAt?.$numberLong) data.joinedAt = parseInt(data.joinedAt.$numberLong)

    }

    return data
}

module.exports = { getServer }