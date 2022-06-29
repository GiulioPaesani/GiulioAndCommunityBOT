const settings = require("../../config/general/settings.json")
const fs = require("fs")

const getAllUsers = async (client, onlyInGuild = true) => {
    let guildUsers = client.guilds.cache.get(settings.idServer).members.cache.map(x => x)

    let data = []

    const folder = fs.readdirSync("./database/users/");
    for (const user of folder) {
        if (onlyInGuild) {
            if (guildUsers.find(x => x.id == user.split(".")[0])) {
                let userstats = fs.readFileSync(`./database/users/${user}`, 'utf8')

                data.push(JSON.parse(userstats))
            }
        }
        else {
            let userstats = fs.readFileSync(`./database/users/${user}`, 'utf8')
            data.push(JSON.parse(userstats))
        }
    }
    return data
}

module.exports = { getAllUsers }