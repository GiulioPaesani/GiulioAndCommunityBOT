const moment = require("moment")
const { isAnnoBisestile } = require("../../../functions/community/birthday/isAnnoBisestile")

const prossimoBirthday = (month, day) => {
    let year

    if (month == 2 && day == 29) {
        if (isAnnoBisestile(new Date().getFullYear())) {
            if (moment([new Date().getFullYear(), month - 1, day]).diff(moment()) > 0) {
                year = new Date().getFullYear()
            }
            else {
                year = new Date().getFullYear() + 1
                month = 3
                day = 1
            }
        }
        else {
            if (moment([new Date().getFullYear(), 2, 1]).diff(moment()) > 0) {
                year = new Date().getFullYear()
                month = 3
                day = 1
            }
            else {
                if (!isAnnoBisestile(new Date().getFullYear() + 1)) {
                    month = 3
                    day = 1
                }
                year = new Date().getFullYear() + 1
            }
        }
    }

    if (moment([new Date().getFullYear(), month - 1, day]).diff(moment()) > 0) {
        year = new Date().getFullYear()
    }
    else {
        year = new Date().getFullYear() + 1
    }

    return [year, month - 1, day]
}

module.exports = { prossimoBirthday }