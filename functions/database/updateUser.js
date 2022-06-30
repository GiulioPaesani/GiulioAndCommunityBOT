const { getUser } = require("../../functions/database/getUser");
const fs = require("fs")

const updateUser = async (data) => {
    try {
        if (!data) return
        if (!getUser(data.id)) return

        fs.writeFileSync(`./database/users/${data.id}.json`, JSON.stringify(data))
        console.log(data.id, "AGGIORNATO")
    }
    catch (err) {
        console.log("ciao")
        console.log(err)
    }
}

module.exports = { updateUser }