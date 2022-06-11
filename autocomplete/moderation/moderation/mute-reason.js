const reasons = require('../../../config/moderation/reasons.json');

module.exports = {
    commandName: "mute",
    optionName: "reason",
    client: "moderation",
    async getResponse(client, focused) {
        let choices = [];

        reasons.filter(x => x.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
            if (!choices.find(y => y == x)) choices.push(x)
        });

        return choices.map(x => ({ name: x.length > 100 ? `${x.slice(0, 97)}...` : x, value: x.slice(0, 100) }))
    }
}