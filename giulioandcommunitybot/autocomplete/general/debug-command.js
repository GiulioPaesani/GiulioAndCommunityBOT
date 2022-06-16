const fetch = require("node-fetch")

module.exports = {
    commandName: "debug",
    optionName: "command",
    client: "general",
    async getResponse(client, focused) {
        let choices = []

        let funCommands = await fetch("http://localhost:5001/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (funCommands) {
            funCommands = await funCommands.text()
            funCommands = JSON.parse(funCommands).commands
        }
        else funCommands = []

        let moderactionCommands = await fetch("http://localhost:5002/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (moderactionCommands) {
            moderactionCommands = await moderactionCommands.text()
            moderactionCommands = JSON.parse(moderactionCommands).commands
        }
        else moderactionCommands = []

        let rankingCommands = await fetch("http://localhost:5003/client", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": String(process.env.apiKey)
            }
        }).catch(() => { })

        if (rankingCommands) {
            rankingCommands = await rankingCommands.text()
            rankingCommands = JSON.parse(rankingCommands).commands
        }
        else rankingCommands = []

        client.commands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
            if (!choices.find(y => y.name == x.name)) choices.push(x);
        });

        if (choices.length < 25)
            moderactionCommands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            funCommands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            rankingCommands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });


        if (choices.length < 25)
            client.commands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            moderactionCommands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            funCommands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            rankingCommands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            client.commands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            moderactionCommands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            funCommands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            rankingCommands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        return choices.map(x => ({ name: x.name, value: x.name }))
    }
}