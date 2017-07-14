const JsonServer = require('../../server');

module.exports = class extends JsonServer {
    constructor() {
        super({port:8212});
    }

    onStarted() {
        console.log("onStarted");
    }

    onStopped() {
        console.log("onStopped");
    }

    onConnected(socket) {
        console.log(`onConnected from ${socket.remoteAddress}:${socket.remotePort}`);
    }

    onClosed(socket) {
        console.log(`onClosed from ${socket.remoteAddress}:${stocket.remotePort}`);
    }

    onError(socket, err) {
        console.error(err.stack);
    }

    async process({command, payload}) {
        return {status:0, payload:payload};
    }
}