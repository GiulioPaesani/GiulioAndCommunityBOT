const fs = require("fs")

const getUser = async (userId) => {
    try {
        let data = JSON.parse(fs.readFileSync(`./database/users/${userId}.json`, 'utf8'))
        return data
    }
    catch { }
}

module.exports = { getUser }