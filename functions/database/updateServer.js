const Servers = require("../../schemas/Servers");

const updateServer = async (data) => {
    await Servers.updateOne({}, data)
}

module.exports = { updateServer }