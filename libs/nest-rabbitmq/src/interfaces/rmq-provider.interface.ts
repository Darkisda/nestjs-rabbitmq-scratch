import * as amqp from 'amqplib';

export interface RMQProvider {
	conn: amqp.Connection;
	ch: amqp.Channel;
}
