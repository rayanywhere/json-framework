const TcpClient = require('tcp-framework').Client;
const Message = require('tcp-framework').Message;
const Ajv = require('ajv');
const ajv = new Ajv();
const assert = require('assert');

module.exports = class extends TcpClient {
   constructor(options) {
        super(options);
        this._pendingCallbacks = new Map();
    }

    onMessage(incomingMessage) {
        const callback = this._pendingCallbacks.get(incomingMessage.uuid);
        if (callback !== undefined) {
            callback.success(incomingMessage);
        }
    }

    _request(outgoingMessage) {
        return new Promise((resolve, reject) => {
            this._pendingCallbacks.set(outgoingMessage.uuid, {
                success: response => { this._pendingCallbacks.delete(outgoingMessage.uuid); resolve(response); },
                failure: error => { this._pendingCallbacks.delete(outgoingMessage.uuid); reject(error); }
            });
            this.send(outgoingMessage);
            setTimeout(() => {
                let callback = this._pendingCallbacks.get(outgoingMessage.uuid);
                if (callback !== undefined) {
                    callback.failure(new Error('request timeout'));
                }
            }, 1000 * this._options.timeout);
        });
    }

    async request({command, payload}) {
        const outgoingMessage = new Message(Message.SIGN_DATA, Buffer.from(JSON.stringify({command, payload}), 'utf8'));
        const incomingMessage = await this._request(outgoingMessage);
        const response = JSON.parse(incomingMessage.payload.toString('utf8'));
        assert(ajv.validate({
            type: "object",
            properties: {
                status: {type: "integer"},
                payload: {}
            },
            additionalProperties: false,
            required: ["status"]
        }, response), ajv.errorsText());
        return response;
    }
};