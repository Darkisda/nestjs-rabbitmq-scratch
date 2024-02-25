import { NestRabbitmqModule } from '@app/nest-rabbitmq';
import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';

@Module({
	imports: [
		NestRabbitmqModule.connect('luan', 'secret', 'localhost:5672', '/', true),
	],
	controllers: [ConsumerController],
	providers: [ConsumerService],
})
export class ConsumerModule {}
