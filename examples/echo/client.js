const JsonClient = require('../../client');

module.exports = class extends JsonClient {
    constructor() {
        super({port: 8212});
    }

    echo(word) {
        return this.request({
            command:"echo",
            payload: word
        });
    }
};