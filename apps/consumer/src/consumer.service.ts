import { NestRabbitmqService } from '@app/nest-rabbitmq';
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class ConsumerService implements OnModuleInit, OnModuleDestroy {
	private logger = new Logger(ConsumerService.name);
	private exchange: amqp.Replies.AssertExchange;
	private queue: amqp.Replies.AssertQueue;

	constructor(private readonly rabbitmqService: NestRabbitmqService) {}

	async onModuleInit() {
		this.exchange = await this.rabbitmqService.createExchange(
			'producer_exchange_1',
			'fanout',
			{ durable: true, autoDelete: true },
		);
		this.queue = await this.rabbitmqService.createQueue('', false, true);
		await this.rabbitmqService.createBinding(
			this.queue.queue,
			this.exchange.exchange,
			'',
		);
	}

	async onModuleDestroy() {
		await this.rabbitmqService.close();
	}

	getHello(): string {
		return 'Hello World!';
	}

	async consumeMessage() {
		await this.rabbitmqService.consume(
			this.queue.queue,
			this.exchange.exchange,
			true,
			function (msg) {
				if (msg.content) {
					console.log(' [x] %s', msg.content.toString());
				}
			},
		);
	}
}
