const settings = require("../../config/general/settings.json")
const Users = require("../../schemas/Users");
const fs = require("fs")

const getAllUsers = async (client, onlyInGuild = true) => {
    let guildUsers = client.guilds.cache.get(settings.idServer).members.cache.map(x => x)

    let data = []

    const commandsFolder = fs.readdirSync("./database/users");
    for (const user of commandsFolder) {
        if (onlyInGuild) {
            if (guildUsers.find(x => x.id == user.split(".")[0])) {
                data.push(JSON.parse(fs.readFileSync(`./database/users/${user}`, 'utf8')))
            }
        }
        else {
            data.push(JSON.parse(fs.readFileSync(`./database/users/${user}`, 'utf8')))
        }
    }
    return data
}

module.exports = { getAllUsers }