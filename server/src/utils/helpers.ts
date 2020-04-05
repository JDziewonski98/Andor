export function mapToJson(map){
    // let temp = {};
    // map.forEach((value, key) => {
    //     temp[key] = value;
    // });;
    // return temp;
    return JSON.stringify([...map]);
}

export function jsonToMap(obj){
    return new Map(JSON.parse(obj));
}