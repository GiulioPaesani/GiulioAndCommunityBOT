const settings = require("../../config/general/settings.json")
const ttsLanguage = require("../../config/general/ttsLanguage.json")

module.exports = {
    commandName: "ttslanguage",
    optionName: "language",
    client: "general",
    async getResponse(client, focused) {
        let choices = []

        ttsLanguage.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
            if (!choices.find(y => y.code == x.code)) choices.push(x)
        });

        ttsLanguage.filter(x => x.code.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
            if (!choices.find(y => y.code == x.code)) choices.push(x)
        });

        return choices.map(x => ({ name: x.name, value: x.code }))
    }
}