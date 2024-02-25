import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RMQ_PROVIDER } from './constants';
import { CannotBindingQueue, CannotCreateQueueError } from './errors';
import { RMQProvider } from './interfaces';

@Injectable({ scope: Scope.TRANSIENT })
export class NestRabbitmqService {
	private logger = new Logger(NestRabbitmqService.name);
	private conn: amqp.Connection;
	private ch: amqp.Channel;

	constructor(@Inject(RMQ_PROVIDER) private readonly rmqProvider: RMQProvider) {
		this.conn = this.rmqProvider.conn;
		this.ch = this.rmqProvider.ch;
	}

	/**
	 * Responsável por criar uma nova exchange
	 * @param name - Nome da Exchange
	 * @param type - Tipos de exchange. Veja mais em {@link https://www.rabbitmq.com/tutorials/tutorial-three-javascript#exchanges}
	 * @param options - Opções de configuração da exchange. Veja mais em {@link https://www.rabbitmq.com/tutorials/tutorial-three-javascript#exchanges}
	 * @returns Exchange criada.
	 */
	async createExchange(
		name: string,
		type: 'fanout' | 'topic' | 'direct' | 'headers',
		options?: amqp.Options.AssertExchange,
	) {
		try {
			return await this.ch.assertExchange(name, type, options);
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async createQueue(queueName: string, durable: boolean, autoDelete: boolean) {
		try {
			const queue = await this.ch.assertQueue(queueName, {
				durable,
				autoDelete,
			});
			return queue;
		} catch (error) {
			this.logger.error(error);
			throw new CannotCreateQueueError();
		}
	}

	async createBinding(name: string, exchange: string, binding: string) {
		try {
			await this.ch.bindQueue(name, exchange, binding);
		} catch (error) {
			this.logger.error(error);
			throw new CannotBindingQueue();
		}
	}

	async send(
		exchange: string,
		routingKey: string,
		content: Buffer,
		options?: amqp.Options.Publish,
	) {
		try {
			this.ch.publish(exchange, routingKey, content, options);
		} catch (error) {
			this.logger.error(error);
		}
	}

	async consume(
		queueName: string,
		consumer: string,
		noAck: boolean,
		consumeCb: (msg: amqp.ConsumeMessage | null) => void,
	) {
		try {
			await this.ch.consume(queueName, consumeCb, {
				consumerTag: consumer,
				noAck,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}

	async close() {
		return this.conn && (await this.conn.close());
	}
}
