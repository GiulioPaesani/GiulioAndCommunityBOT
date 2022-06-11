module.exports = {
    commandName: "code",
    optionName: "codice",
    client: "general",
    async getResponse(client, focused) {
        let choices = []

        client.codes.filter(x => x.id.includes(focused.value)).map(x => x).forEach(x => {
            if (!choices.find(y => y.id == x.id)) choices.push(x)
        });

        if (choices.length < 25)
            client.codes.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.codes.filter(x => x.aliases.find(y => y.toLowerCase().includes(focused.value.toLowerCase()))).map(x => x).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.codes.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.codes.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        if (choices.length < 25)
            client.codes.filter(x => x.info.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.id == x.id)) choices.push(x)
            });

        return choices.map(x => ({ name: `${x.name} - ${x.description.replace(/\*/g, "").length > (100 - 3 - x.name.length) ? `${x.description.replace(/\*/g, "").slice(0, 100 - 3 - x.name.length - 3)}...` : x.description.replace(/\*/g, "")}`, value: x.id }))
    }
}