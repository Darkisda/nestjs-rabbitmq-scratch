import { DynamicModule, Logger, Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RMQ_PROVIDER } from './constants';
import { RMQProvider } from './interfaces';
import { NestRabbitmqService } from './nest-rabbitmq.service';

@Module({})
export class NestRabbitmqModule {
	static async connect(
		username: string,
		password: string,
		host: string,
		vhost: string,
		useConfirmChannel: boolean,
	): Promise<DynamicModule> {
		const logger = new Logger(NestRabbitmqModule.name);

		return {
			module: NestRabbitmqModule,
			providers: [
				{
					provide: RMQ_PROVIDER,
					useFactory: async (): Promise<RMQProvider> => {
						try {
							logger.log('Connecting to RabbitMQ...');
							const connection = await amqp.connect(
								`amqp://${username}:${password}@${host}/${vhost}`,
							);

							const channel = useConfirmChannel
								? await connection.createConfirmChannel()
								: await connection.createChannel();
							return {
								ch: channel,
								conn: connection,
							};
						} catch (error) {
							logger.error(error);
							throw error;
						}
					},
				},
				NestRabbitmqService,
			],
			exports: [NestRabbitmqService],
		};
	}
}
