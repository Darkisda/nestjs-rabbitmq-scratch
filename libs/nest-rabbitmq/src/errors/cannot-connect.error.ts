export class CannotConnectError extends Error {
	constructor() {
		super('Cannot Connect to RabbitMQ');
	}
}
