const settings = require("../../config/general/settings.json")

const getTaggedUser = async (client, string, onlyInGuild = false) => {
    if (!string) return

    //id
    let user = client.users.cache.get(string.split(/\+/)[0])

    //<@id>
    if (!user) user = client.users.cache.get(string.split(/\+/)[0].slice(2, -1))

    //<@!id>
    if (!user) user = client.users.cache.get(string.split(/\+/)[0].slice(3, -1))

    //Username
    if (!user) user = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.user.username == string)

    //Username lowerCase
    if (!user) user = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.user.username.toLowerCase() == string.toLowerCase())

    //Nickname
    if (!user) user = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.nickname && x.nickname == string)

    //Nickname lowerCase
    if (!user) user = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.nickname && x.nickname.toLowerCase() == string.toLowerCase())

    if (!user) user = await client.users.fetch(string.split(/\+/)[0]).catch(() => { })

    if (onlyInGuild)
        return client.guilds.cache.get(settings.idServer).members.cache.get(user?.id)?.user
    else
        return (client.guilds.cache.get(settings.idServer).members.cache.get(user?.id)?.user || user)
}

module.exports = { getTaggedUser }