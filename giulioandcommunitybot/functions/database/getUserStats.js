const fs = require("fs")

const getUserStats = (userId) => {
    try {
        let data = JSON.parse(fs.readFileSync(`../database/users/${userId}/${userId}Stats.json`, 'utf8'))
        return data
    }
    catch { }
}

module.exports = { getUserStats }