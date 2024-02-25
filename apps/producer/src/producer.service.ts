import { NestRabbitmqService } from '@app/nest-rabbitmq';
import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
	private logger = new Logger(ProducerService.name);
	private exchange: amqp.Replies.AssertExchange;

	constructor(private readonly rabbitmqService: NestRabbitmqService) {}

	async onModuleInit() {
		this.exchange = await this.rabbitmqService.createExchange(
			'producer_exchange_1',
			'fanout',
			{ durable: true, autoDelete: true },
		);
	}

	async onModuleDestroy() {
		await this.rabbitmqService.close();
	}

	getHello(): string {
		return 'Hello World!';
	}

	async sayHello() {
		await this.rabbitmqService.send(
			this.exchange.exchange,
			'exemple',
			Buffer.from('Hello World'),
			{ contentType: 'text/plan', deliveryMode: 1 },
		);
	}
}
