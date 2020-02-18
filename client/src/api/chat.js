import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

var socket = connect()
function connect() {
    return io.connect(BASE_API + "/chat");
}

export function send(msg, callback) {
    socket.emit("send message", msg, callback);
}

export function recieve(callback) {
    socket.on("update messages", callback);
}