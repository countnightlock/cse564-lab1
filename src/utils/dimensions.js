/**
 * Dimension Config
 */

function createDimensions() {
    const map = new Map();
    map.set('key', (() => {
        const map = new Map();
        map.set('name', 'key');
        map.set('title', 'Key');
        map.set('description', 'The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1.');
        const valueMap = new Map();
        valueMap.set('0', 'C');
        valueMap.set('1', 'C♯, D♭');
        valueMap.set('2', 'D');
        valueMap.set('3', 'D♯, E♭');
        valueMap.set('4', 'E');
        valueMap.set('5', 'F');
        valueMap.set('6', 'F♯, G♭');
        valueMap.set('7', 'G');
        valueMap.set('8', 'G♯, A♭');
        valueMap.set('9', 'A');
        valueMap.set('10', 'A♯, B♭');
        valueMap.set('11', 'B');
        map.set('valueMap', valueMap);
        return map;
    })());

    return map;
}

module.exports.dimensions = createDimensions();
