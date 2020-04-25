
export function mapToJson(map){
    return JSON.stringify([...map]);
}

export function jsonToMap<k, v>(obj){
    // if(obj instanceof Array){
    //     console.log(...obj)
    //     return new Map<k, v>(...obj);
    // }
    return new Map<k, v>(JSON.parse(obj));
}
