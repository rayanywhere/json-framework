const TcpServer = require('tcp-framework').Server;
const Message = require('tcp-framework').Message;
const Ajv = require('ajv');
const ajv = new Ajv();
const assert = require('assert');

module.exports = class extends TcpServer {
    onMessage(socket, incomingMessage) {
        let request = undefined;
        try {
            request = JSON.parse(incomingMessage.payload.toString('utf8'));
            assert(!ajv.validate({
                type: "object",
                properties: {
                    command: {type: "string"},
                    payload: {}
                },
                additionalProperties: false,
                required: ["command"]
            }), ajv.errorsText());
        }
        catch(err) {
            this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({status:-1}), 'utf8'), incomingMessage.uuid));
            return;
        }

        this.process(request).then(response => {
            this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify(response), 'utf8'), incomingMessage.uuid));
        }).catch((err) => {
            this.send(socket, new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({status:-1}), 'utf8'), incomingMessage.uuid));
        });
    }

    process({command, payload}) {
        return Promise.reject(new Error('this method is meant to be implemented'));
    }
};