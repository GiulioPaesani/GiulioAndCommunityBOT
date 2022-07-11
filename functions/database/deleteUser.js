const fs = require("fs")
const { getUser } = require("../../functions/database/getUser")

const deleteUser = async (userId) => {
    try {

        let userstats = await getUser(member.id)

        if (!userstats) return

        fs.unlinkSync(`./database/users/${userId}.json`)
    }
    catch { }
}

module.exports = { deleteUser }