import { NestRabbitmqModule } from '@app/nest-rabbitmq';
import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
	imports: [
		NestRabbitmqModule.connect('luan', 'secret', 'localhost:5672', '/', true),
	],
	controllers: [ProducerController],
	providers: [ProducerService],
})
export class ProducerModule {}
