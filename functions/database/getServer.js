const Servers = require("../../schemas/Servers");

const getServer = async () => {
    const data = await Servers.findOne({});

    return data
}

module.exports = { getServer }