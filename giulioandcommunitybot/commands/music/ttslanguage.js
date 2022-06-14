const settings = require("../../config/general/settings.json")
const { replyMessage } = require("../../functions/general/replyMessage");
const ttsLanguage = require("../../config/general/ttsLanguage.json");
const { getServer } = require("../../functions/database/getServer");
const { updateServer } = require("../../functions/database/updateServer");

module.exports = {
    name: "ttslanguage",
    description: "Impostare la lingua di default per il tts",
    permissionLevel: 0,
    requiredLevel: 0,
    syntax: "/ttslanguage [language]",
    category: "music",
    client: "general",
    data: {
        options: [
            {
                name: "language",
                description: "Lingua da impostare come default",
                type: "STRING",
                required: true,
                autocomplete: true
            }
        ]
    },
    channelsGranted: [settings.idCanaliServer.commands, settings.idCanaliServer.noMicChat, settings.idCanaliServer.general1, settings.idCanaliServer.general2],
    async execute(client, interaction, comando) {
        let language = interaction.options.getString("language")

        language = ttsLanguage.find(x => x.code.toLowerCase() == language.toLowerCase()) || ttsLanguage.find(x => x.name.toLowerCase().includes(language.toLowerCase()))

        let serverstats = getServer()
        if (serverstats.ttsDefaultLanguage == language.code) {
            return replyMessage(client, interaction, "Warning", "Lingua già impostata", "Questa lingua è già impostata come default")
        }

        serverstats.ttsDefaultLanguage = language.code
        updateServer(serverstats)

        replyMessage(client, interaction, "Correct", "Lingua di default impostata", `${language.name} impostata come lingua di default per il tts`, comando)
    }
};