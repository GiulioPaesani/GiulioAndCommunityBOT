const fs = require("fs")

const getUser = (userId) => {
    try {
        let data = JSON.parse(fs.readFileSync(`../database/users/${userId}/${userId}.json`, 'utf8'))
        return data
    }
    catch { }
}

module.exports = { getUser }