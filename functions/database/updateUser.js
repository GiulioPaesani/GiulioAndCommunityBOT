const fs = require("fs")
const { getUser } = require("./getUser")

const updateUser = (data) => {
    try {
        if (!data) return
        if (!getUser(data.id)) return

        fs.writeFileSync(`./database/users/${data.id}/${data.id}.json`, JSON.stringify(data))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { updateUser }