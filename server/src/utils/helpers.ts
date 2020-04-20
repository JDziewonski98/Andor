export function mapToJson(map){
    // let temp = {};
    // map.forEach((value, key) => {
    //     temp[key] = value;
    // });;
    // return temp;
    return JSON.stringify([...map]);
}

export function jsonToMap<k, v>(obj){
    return new Map<k, v>(JSON.parse(obj));
}