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


capitalize1stLetter("capitalize1stLetter");

// export default {
//     sortArryByKey,
//     capitalize1stLetter
// }