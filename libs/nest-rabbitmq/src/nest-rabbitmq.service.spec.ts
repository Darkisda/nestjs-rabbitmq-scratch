import { Test, TestingModule } from '@nestjs/testing';
import { NestRabbitmqService } from './nest-rabbitmq.service';

describe('NestRabbitmqService', () => {
	let service: NestRabbitmqService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NestRabbitmqService],
		}).compile();

		service = module.get<NestRabbitmqService>(NestRabbitmqService);
		await service.connect('luan', 'secret', 'localhost:5672', '/');
	});

	afterEach(async () => {
		await service.close();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should throw error to connect to RabbitMQ', async () => {
		expect(
			async () => await service.connect('false', 'null', 'localhost:5672', '/'),
		).rejects.toThrow('Cannot Connect to RabbitMQ');
	});

	it('should create a new queue', async () => {
		expect(
			await service.createQueue('anotherQueue', false, true),
		).toBeDefined();
	});

	// it('should binding queue to a exchange', async () => {
	// 	const queue = await service.createQueue('anotherQueue2', false, true);
	// 	expect(
	// 		async () => await service.createBinding(queue.queue, 'tests_event', ''),
	// 	).not.toThrow();
	// });

	it('should send a message to queue', () => {
		expect(
			service.send('tests_event', '', Buffer.from('Hello World')),
		).toBeTruthy();
	});

	it('should consume a message from queue', async () => {
		service.send('tests_event', '', Buffer.from('Hello World'));

		expect(async () =>
			service.consume('tests_event', 'tests', false),
		).toBeDefined();
	});
});
