const humanizeTime = (seconds) => {
    return `${Math.floor(seconds / 3600) > 0 ? `${Math.floor(seconds / 3600)}:` : ""}${Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60) < 10 && Math.floor(seconds / 3600) > 0 ? `0${Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60)}` : Math.floor((seconds - Math.floor(seconds / 3600) * 3600) / 60)}:${(seconds - Math.floor(seconds / 60) * 60) < 10 ? `0${Math.floor(seconds - Math.floor(seconds / 60) * 60)}` : Math.floor(seconds - Math.floor(seconds / 60) * 60)}`
}

module.exports = { humanizeTime }