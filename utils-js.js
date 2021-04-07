/**
 * Return font size to make sure 1 line text always fix in box.
 *
 * @param {number} `bWidth` box width
 * @param {number} `bHeight` box height
 * @param {string} `text` text to render
 * @param {number} `candidateFontSize` candidator font size
 * @note simulate adjustFontSizeToFixWidth on iOS for Android
 * @returns {number} font size
 */
function calculateFontSizeForText(bWidth, bHeight, text, candidateFontSize) {
    let fontSize = Math.sqrt(bWidth * bHeight / `${text}`.length);
    fontSize = Math.min(fontSize, candidateFontSize);
    return fontSize;
}
/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
function arrayContainsArray(superset, subset) {
    // solution 1
    return _.difference(subset, superset).length === 0;

    // solution 2
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    });
}

function sortArryByKey(arr = [], key = "id", isDescending = false) {
    let newArr = arr.sort(function compareFunc(obj1, obj2) {
        return isDescending ? obj1[key] < obj2[key] : obj1[key] > obj2[key]
    });
    console.log("sortArryByKey", newArr);
    return newArr;
}

function capitalize1stLetter(text = "") {
    const lower = text.toLowerCase();
    const upper = lower.charAt(0).toUpperCase() + lower.substr(1);
    console.log("capitalize1stLetter", upper);
    return upper;
}

function transformArrayToDictionaryByKey(arr, key) {
    let dict = {};
    arr.forEach(element => {
        let kVale = element[key];
        dict[kVale] = {
            ...element
        };
    });
    return dict;
}

function parseFbAvatarUrl(url) {
    let avatar = url;
    if (!!url) {
        const patternPrefix = "asid=";
        let regexResult = /asid=[0-9]*/.exec(url);
        if (!!regexResult && !!regexResult[0] && regexResult[0].length > patternPrefix.length) {
            let fbID = regexResult[0].substr(patternPrefix.length, regexResult[0].length - patternPrefix.length)
            avatar = `https://graph.facebook.com/${fbID}/picture?type=large`;
        } else {
            avatar = this._avatar + "?ts=" + Math.random()
        }
    }
    return avatar;
}

function unique(arr, primaryKey) {
    let map = new Map();
    let result = [];
    for (const item of arr) {
        if (!map.has(item[primaryKey])) {
            map.set(item[primaryKey], true);
            result.push(item);
        }
    }
    return result
}

let res = parseFbAvatarUrl("https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1863308063755381&height=50&width=50&ext=1547891887&hash=AeQEeYEGlcVKRGV5");
function insertItemAtIndex(arr, item, index) {
    return arr.splice(index, 0, item);
}

function removeItemAtIndex(arr, index) {
    return arr.splice(index, 1);
}

console.log(unique([{
    id: 1,
    name: 'a'
},
{
    id: 12,
    name: 'a'
},
{
    id: 1,
    name: 'b'
},
], 'id'));
// export default {
//     sortArryByKey,
//     capitalize1stLetter
// }

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

/**
 * Disallow dynamic type on iOS.
 * MUST IMPORT Text , TextInput component from react-native module FIRSTLY
 */

function disableAutoResizeFont() {
    if (!!!Text.defaultProps) {
        Text.defaultProps = {};
    }
    if (!!!TextInput.defaultProps) {
        TextInput.defaultProps = {};
    }
    Text.defaultProps.allowFontScaling = false; // Disallow dynamic type on iOS
    TextInput.defaultProps.allowFontScaling = false; // Disallow dynamic type on iOS
}

/**
 * Rearrange string character.
 */
var sortAlphabets = function (text) {
    return text.split('').sort().join('');
};


/**
 * test me now
 */