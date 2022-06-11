const moveElementInArray = (array, from, to) => {
    let element = array[from];

    array.splice(from, 1);
    array.splice(to, 0, element);

    return array
}

module.exports = { moveElementInArray }