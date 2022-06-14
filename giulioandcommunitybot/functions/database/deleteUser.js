const fs = require("fs")
const { getUser } = require("./getUser")
const { getUserStats } = require("./getUserStats")

const deleteUser = (userId, only = [true, true]) => {
    try {
        if (only[0] && getUser(userId)) fs.unlinkSync(`../database/users/${userId}/${userId}.json`)
        if (only[1] && getUserStats(userId)) fs.unlinkSync(`../database/users/${userId}/${userId}Stats.json`)
        if (!getUser(userId) && !getUserStats(userId)) fs.rmdirSync(`../database/users/${userId}`)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { deleteUser }