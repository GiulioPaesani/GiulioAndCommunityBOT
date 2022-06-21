const Users = require("../../schemas/Users");

const getUser = async (userId) => {
    const data = await Users.findOne({ id: userId });

    return data
}

module.exports = { getUser }