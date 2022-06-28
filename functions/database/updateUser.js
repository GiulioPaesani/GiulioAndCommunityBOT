const Users = require("../../schemas/Users");
const { getUser } = require("../../functions/database/getUser");

const updateUser = async (data) => {
    try {
        if (!data) return
        if (!getUser(data.id)) return

        fs.writeFileSync(`./database/users/${a.data.id}.json`, JSON.stringify(data))
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { updateUser }