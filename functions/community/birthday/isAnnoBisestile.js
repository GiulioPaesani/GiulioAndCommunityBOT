const moment = require("moment")

const isAnnoBisestile = (year) => {
    year = parseInt(year)
    if (!year) return

    return moment([year]).isLeapYear()
}

module.exports = { isAnnoBisestile }