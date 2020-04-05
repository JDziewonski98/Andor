export function serializeMap(map){
    let temp = {};
    map.forEach((value, key) => {
        temp[key] = value;
    });;
    return temp;
}