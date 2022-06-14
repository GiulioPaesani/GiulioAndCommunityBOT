const fs = require("fs")

const getServerStats = () => {
    let data = JSON.parse(fs.readFileSync('../database/server/serverStats.json', 'utf8'))
    return data
}

module.exports = { getServerStats }