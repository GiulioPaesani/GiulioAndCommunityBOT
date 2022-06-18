const fs = require("fs")
const { getUser } = require("./getUser")

const updateUserStats = (userId, data) => {
    try {
        if (!data) return
        if (!getUser(userId)) return

        fs.writeFileSync(`./database/users/${userId}/${userId}Stats.json`, JSON.stringify(data))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { updateUserStats }