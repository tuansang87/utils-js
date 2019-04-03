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