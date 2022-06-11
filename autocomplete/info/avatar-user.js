const settings = require("../../config/general/settings.json")

module.exports = {
    commandName: "avatar",
    optionName: "user",
    client: "general",
    async getResponse(client, focused) {
        let choices = []

        client.guilds.cache.get(settings.idServer).members.cache.filter(x => x.id.includes(focused.value)).forEach(x => {
            if (!choices.find(y => y.id == x.id)) choices.push(x)
        });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => x.user.username.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => x.user.tag.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => x.nickname && x.nickname.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        let userFetched
        if (choices.length < 25)
            userFetched = await client.users.fetch(focused.value).catch(() => { })

        if (userFetched && !choices.find(y => y.id == userFetched.id)) choices.push(userFetched)

        return choices.map(x => ({ name: `${x.nickname ? `${x.nickname}#${x.user.discriminator}` : (x.user?.tag || x.tag)} (ID: ${x.id})`, value: x.id }))
    }
}