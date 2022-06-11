const humanize = (number) => {
    if (!number) return "0"

    number = parseInt(number)

    return number.toString().split("").reverse().join("").match(/.{1,3}/g).join(".").split("").reverse().join("")
}

module.exports = { humanize }