export default class {
    static generate() {
        // from w3schools
        var dt = new Date().getTime();
        var uuid = 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
}

