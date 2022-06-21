const Users = require("../../schemas/Users");
const { getUser } = require("../../functions/database/getUser");

const updateUser = async (data) => {
    if (!data) return

    const userstats = await getUser(data.id)
    if (!userstats) return

    await Users.updateOne({ id: data.id }, data)
}

module.exports = { updateUser }