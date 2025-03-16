// user-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'user-service',
        brokers: [configService.get('KAFKA_BROKER', 'localhost:9092')],
      },
      consumer: {
        groupId: 'user-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
