const { musicBots, client, clientModeration, clientFun, clientRanking } = require("../../index");

module.exports = {
    commandName: "debug",
    optionName: "command",
    client: "general",
    async getResponse(client, focused) {
        let choices = []


        client.commands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
            if (!choices.find(y => y.name == x.name)) choices.push(x);
        });

        if (choices.length < 25)
            clientModeration.commands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientFun.commands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientRanking.commands.filter(x => x.name.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });


        if (choices.length < 25)
            client.commands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientModeration.commands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientFun.commands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientRanking.commands.filter(x => x.description.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            client.commands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientModeration.commands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientFun.commands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        if (choices.length < 25)
            clientRanking.commands.filter(x => x.category.toLowerCase().includes(focused.value.toLowerCase())).map(x => x).forEach(x => {
                if (!choices.find(y => y.name == x.name)) choices.push(x);
            });

        return choices.map(x => ({ name: x.name, value: x.name }))
    }
}