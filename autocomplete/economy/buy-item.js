const items = require("../../config/ranking/items.json")

module.exports = {
    commandName: "buy",
    optionName: "item",
    client: "ranking",
    async getResponse(client, focused) {
        let choices = []

        items.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
            if (!choices.find(y => y.id == x.id)) choices.push(x)
        });

        if (choices.length < 25)
            items.filter(x => x.id.includes(focused.value) || x.id.includes(focused.value.slice(1))).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            items.filter(x => x.alias.find(y => y.toLowerCase().includes(focused.value.toLowerCase()))).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            items.filter(x => x.category.includes(focused.value)).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });


        return choices.map(x => ({ name: x.name, value: x.id }))
    }
}