const EchoClient = require('../examples/echo/client');
const EchoServer = require('../examples/echo/server');
const assert = require('assert');

describe("#json-framework", function() {
	it('should return without error', testEcho);
})

async function testEcho() {
	let server = new EchoServer();
	server.start();

	let client = new EchoClient();
	let response = await client.echo('hi');
	assert(response.status === 0 && response.payload === 'hi', "bad response");
}