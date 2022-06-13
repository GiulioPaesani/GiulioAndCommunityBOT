const settings = require("../../../config/general/settings.json")
const { getAllUsers } = require("../../../functions/database/getAllUsers")

module.exports = {
    commandName: "unmute",
    optionName: "user",
    client: "moderation",
    async getResponse(client, focused) {
        let userstatsList = getAllUsers(client)
        let choices = []

        client.guilds.cache.get(settings.idServer).members.cache.filter(x => userstatsList.find(y => y.id == x.id && (y.moderation.type == "Muted" || y.moderation.type == "Tempmuted"))).filter(x => x.id.includes(focused.value)).forEach(x => {
            if (!choices.find(y => y.id == x.id)) choices.push(x)
        });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => userstatsList.find(y => y.id == x.id && (y.moderation.type == "Muted" || y.moderation.type == "Tempmuted"))).filter(x => x.user.username.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => userstatsList.find(y => y.id == x.id && (y.moderation.type == "Muted" || y.moderation.type == "Tempmuted"))).filter(x => x.user.tag.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.guilds.cache.get(settings.idServer).members.cache.filter(x => userstatsList.find(y => y.id == x.id && (y.moderation.type == "Muted" || y.moderation.type == "Tempmuted"))).filter(x => x.nickname && x.nickname.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        return choices.map(x => ({ name: `${x.nickname ? `${x.nickname}#${x.user.discriminator}` : (x.user?.tag || x.tag)} (ID: ${x.id})`, value: x.id }))
    }
}