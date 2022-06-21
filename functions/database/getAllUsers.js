const settings = require("../../config/general/settings.json")
const Users = require("../../schemas/Users");

const getAllUsers = async (client, onlyInGuild = true) => {
    let guildUsers = client.guilds.cache.get(settings.idServer).members.cache.map(x => x)

    let data = await Users.find({});

    if (onlyInGuild) data = data.filter(x => guildUsers.find(y => y.id == x.id))

    return data
}

module.exports = { getAllUsers }