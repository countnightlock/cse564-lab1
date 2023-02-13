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

    map.set('mode', (() => {
        const map = new Map();
        map.set('name', 'mode');
        map.set('title', 'Mode');
        map.set('description', 'Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.');
        const valueMap = new Map();
        valueMap.set('0', 'Minor');
        valueMap.set('1', 'Major');
        map.set('valueMap', valueMap);
        return map;
    })());

    map.set('time_signature', (() => {
        const map = new Map();
        map.set('name', 'time_signature');
        map.set('title', 'Time Signature');
        map.set('description', 'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".');
        const valueMap = new Map();
        valueMap.set('3', '3/4');
        valueMap.set('4', '4/4');
        valueMap.set('5', '5/4');
        valueMap.set('6', '6/4');
        valueMap.set('7', '7/4');
        map.set('valueMap', valueMap);
        return map;
    })());

    return map;
}

module.exports.dimensions = createDimensions();
